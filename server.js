const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const formRevocationService = require('./public/js/FormRevocationService.js');
require('dotenv').config();

const app = express();
app.use(cors());

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
    './request4.html'
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

// Upload new form with files
// app.post('/upload', upload.array('files'), async (req, res) => {
//     try {
//         const formData = {
//             date: req.body.date,
//             fullName: req.body.fullName,
//             studentID: req.body.studentID,
//             department: req.body.department,
//             year: parseInt(req.body.year),
//             address: req.body.address,
//             district: req.body.district,
//             subdistrict: req.body.subdistrict,
//             province: req.body.province,
//             studentTel: req.body.studentTel,
//             parentTel: req.body.parentTel,
//             advisor: req.body.advisor,
//             semester: req.body.semester,
//             courseID: req.body.courseID,
//             courseName: req.body.courseName,
//             section: req.body.section,
//             reason: req.body.reason
//         };

//         const savedForm = await formRevocationService.saveFormWithFiles(formData, req.files);
//         res.status(201).json(savedForm);
//     } catch (err) {
//         console.error('Error in form upload:', err);
//         res.status(500).json({ message: 'Error uploading form' });
//     }
// });

// Get form by student ID
app.get('/student/:studentId', async (req, res) => {
    try {
        const form = await formRevocationService.getFormByStudentId(req.params.studentId);
        if (form) {
            res.json(form);
        } else {
            res.status(404).json({ message: 'Form not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching form' });
    }
});

// Get all forms
app.get('/', async (req, res) => {
    try {
        const forms = await formRevocationService.getAllForms();
        res.json(forms);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching forms' });
    }
});

// Update form
app.put('/:id', async (req, res) => {
    try {
        await formRevocationService.updateForm(parseInt(req.params.id), req.body);
        res.json({ message: 'Form updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating form' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});