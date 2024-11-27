const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const sql = require('mssql');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.static('public', {
    index: 'index.html' // กำหนดให้ index.html เป็นหน้าแรกเสมอ
}));

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-strong-secret-key',
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 * 1000,
        sameSite: 'strict'
    },
    rolling: true
};

app.use(session(sessionConfig));

// Middleware ตรวจสอบ authentication
const checkAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        // ถ้าเป็น API request
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // ถ้าเป็น page request
        res.redirect('./index.html');
    }
};

// Routes ที่ต้องการป้องกัน
const protectedPages = [
    './home.html',
    './request0.html',
    './request1.html',
    './request2.html',
    './request3.html',
    './request4.html',
    './editrequest1.html',
    './editrequest2.html',
    './editrequest3.html',
    './editrequest4.html',
    './listrequest.html',
    // เพิ่มหน้าอื่นๆ ที่ต้องการป้องกัน
];

// Middleware สำหรับป้องกันการเข้าถึงหน้าที่ protected โดยตรง
protectedPages.forEach(page => {
    app.get(page, checkAuth, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', page.slice(1)));
    });
});

// API routes
app.post('/api/login', (req, res) => {
    const { username, userData } = req.body;
    if (userData && userData.status === true) {
        req.session.user = {
            username,
            ...userData
        };
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid login' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.clearCookie('sessionId');
        res.json({ success: true });
    });
});

// เพิ่ม route สำหรับตรวจสอบ session
app.get('/api/check-auth', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

const dbConfig = {
    user: 'sa',
    password: 'YourStrong@Passw0rd',
    // port: 1433,
    server: 'localhost', // เช่น 'localhost' , 'host.docker.internal'
    database: 'myDB', // เช่น 'myDB'
    options: {
        encrypt: true, // ใช้เมื่อเชื่อมต่อกับ Azure
        trustServerCertificate: true // ตั้งค่าให้เชื่อมต่อได้โดยไม่ตรวจสอบใบรับรอง SSL
    }
};

app.get('/api/form/delayedReg', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT TOP (1000) * FROM form_delayed_reg');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching student forms:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.put('/api/form/delayedReg/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, address, parent_number, reason } = req.body; // ปรับคอลัมน์ที่ต้องการแก้ไขตามความต้องการ

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.VarChar, id) // ใช้ VarChar เพราะ id เป็นข้อความ
            .input('full_name', sql.VarChar, full_name)
            .input('address', sql.VarChar, address)
            .input('parent_number', sql.VarChar, parent_number)
            .input('reason', sql.VarChar, reason)
            .query(`
                UPDATE form_delayed_reg
                SET full_name = @full_name, address = @address, parent_number = @parent_number, reason = @reason
                WHERE id = @id
            `);
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating student form:', err);
        res.status(500).json({ error: 'Database update failed' });
    }
});

app.delete('/api/form/delayedReg/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        
        // ลบข้อมูลในตาราง attachment ก่อน
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM form_delayed_reg_attachment_files WHERE form_delayed_reg_id = @id');

        // จากนั้นจึงลบข้อมูลหลัก
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM form_delayed_reg WHERE id = @id');
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting student form:', err);
        res.status(500).json({ error: 'Database delete failed', details: err.message });
    }
});

app.get('/api/form/rev', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT TOP (1000) * FROM form_revocation');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching student forms:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.put('/api/form/rev/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, address, parent_number, reason } = req.body; // ปรับคอลัมน์ที่ต้องการแก้ไขตามความต้องการ

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.VarChar, id) // ใช้ VarChar เพราะ id เป็นข้อความ
            .input('full_name', sql.VarChar, full_name)
            .input('address', sql.VarChar, address)
            .input('parent_number', sql.VarChar, parent_number)
            .input('reason', sql.VarChar, reason)
            .query(`
                UPDATE form_revocation
                SET full_name = @full_name, address = @address, parent_number = @parent_number, reason = @reason
                WHERE id = @id
            `);
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating student form:', err);
        res.status(500).json({ error: 'Database update failed' });
    }
});

app.delete('/api/form/rev/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        
        // ลบข้อมูลในตาราง attachment ก่อน
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM form_revocation_attachment_files WHERE form_revocation_id = @id');

        // จากนั้นจึงลบข้อมูลหลัก
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM form_revocation WHERE id = @id');
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting student form:', err);
        res.status(500).json({ error: 'Database delete failed', details: err.message });
    }
});

app.get('/api/form/missing', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT TOP (1000) * FROM form_missing_exam');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching student forms:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.put('/api/form/missing/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, exam_date, reason_missing, reason } = req.body; // ปรับคอลัมน์ที่ต้องการแก้ไขตามความต้องการ

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.VarChar, id) // ใช้ VarChar เพราะ id เป็นข้อความ
            .input('full_name', sql.VarChar, full_name)
            .input('exam_date', sql.VarChar, exam_date)
            .input('reason_missing', sql.VarChar, reason_missing)
            .input('reason', sql.VarChar, reason)
            .query(`
                UPDATE form_missing_exam
                SET full_name = @full_name, exam_date = @exam_date, reason_missing = @reason_missing, reason = @reason
                WHERE id = @id
            `);
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating student form:', err);
        res.status(500).json({ error: 'Database update failed' });
    }
});

app.delete('/api/form/missing/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        
        // ลบข้อมูลในตาราง attachment ก่อน
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM form_missing_exam_attachment_files WHERE form_missing_exam_id = @id');

        // จากนั้นจึงลบข้อมูลหลัก
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM form_missing_exam WHERE id = @id');
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting student form:', err);
        res.status(500).json({ error: 'Database delete failed', details: err.message });
    }
});

app.get('/api/form/absence', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT TOP (1000) * FROM form_absence');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching student forms:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.put('/api/form/absence/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, start_date, end_date, reason } = req.body; // ปรับคอลัมน์ที่ต้องการแก้ไขตามความต้องการ

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.VarChar, id) // ใช้ VarChar เพราะ id เป็นข้อความ
            .input('full_name', sql.VarChar, full_name)
            .input('start_date', sql.VarChar, start_date)
            .input('end_date', sql.VarChar, end_date)
            .input('reason', sql.VarChar, reason)
            .query(`
                UPDATE form_absence
                SET full_name = @full_name, start_date = @start_date, end_date = @end_date, reason = @reason
                WHERE id = @id
            `);
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating student form:', err);
        res.status(500).json({ error: 'Database update failed' });
    }
});

app.delete('/api/form/absence/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        
        // ลบข้อมูลในตาราง attachment ก่อน
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM form_absence_attachment_files WHERE form_absence_id = @id');

        // จากนั้นจึงลบข้อมูลหลัก
        await pool.request()
            .input('id', sql.VarChar, id)
            .query('DELETE FROM form_absence WHERE id = @id');
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting student form:', err);
        res.status(500).json({ error: 'Database delete failed', details: err.message });
    }
});

// API สำหรับส่งข้อมูลและอีเมล
app.post('/api/form/rev/upload', async (req, res) => {
    try {
        const {
            date,
            fullName, 
            studentID, 
            department, 
            year,
            courseID,
            courseName,
            section,
            reason,
            email
        } = req.body;

        // สร้าง transporter สำหรับ Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // อีเมลผู้ส่งจาก .env
                pass: process.env.EMAIL_PASS  // รหัสผ่านของอีเมล
            }
        });

        // สร้าง HTML email template
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'ยืนยันการส่งคำร้อง - ระบบบริการการศึกษา',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                    <h2 style="color: #333;">ยืนยันการส่งคำร้อง</h2>
                    <p>เรียนคุณ ${fullName},</p>
                    <p>คำร้องของคุณถูกส่งเรียบร้อยแล้ว โปรดตรวจสอบรายละเอียดดังนี้:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr><td style="padding: 10px; border: 1px solid #ddd;">วันที่ส่งคำร้อง</td><td style="padding: 10px; border: 1px solid #ddd;">${date}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd;">รหัสนักศึกษา</td><td style="padding: 10px; border: 1px solid #ddd;">${studentID}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd;">ภาควิชา/คณะ</td><td style="padding: 10px; border: 1px solid #ddd;">${department}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd;">ชั้นปี</td><td style="padding: 10px; border: 1px solid #ddd;">${year}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd;">รหัสวิชา</td><td style="padding: 10px; border: 1px solid #ddd;">${courseID}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd;">ชื่อวิชา</td><td style="padding: 10px; border: 1px solid #ddd;">${courseName}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd;">ตอนเรียน</td><td style="padding: 10px; border: 1px solid #ddd;">${section}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd;">เหตุผล</td><td style="padding: 10px; border: 1px solid #ddd;">${reason}</td></tr>
                    </table>
                    <p style="margin-top: 20px;">กรุณารอการตอบกลับจากเจ้าหน้าที่</p>
                    <p style="color: #666; font-size: 0.9em;">หากมีข้อสงสัย กรุณาติดต่อฝ่ายทะเบียน</p>
                </div>
            `
        };

        // ตรวจสอบว่า transporter พร้อมทำงานหรือไม่
        await transporter.verify();
        console.log('Transporter is ready.');

        // ส่งอีเมล
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });        

        // ตอบกลับไปยังไคลเอนต์
        res.status(201).json({
            success: true,
            message: 'Form submitted and email sent successfully'
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the request'
        });
    }
});

async function testConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Database connected successfully');
        await pool.close();
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

testConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});