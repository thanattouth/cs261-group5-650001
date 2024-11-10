// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-strong-secret-key',
    name: 'sessionId', // เปลี่ยนชื่อ cookie จาก connect.sid เป็นชื่อที่กำหนดเอง
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 * 1000,
        sameSite: 'strict'
    },
    rolling: true // ต่ออายุ session ทุกครั้งที่มีการ request
};

app.use(session(sessionConfig));

// Middleware ตรวจสอบ session
const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// ใช้ middleware กับ routes ที่ต้องการป้องกัน
app.get('/api/protected', checkSession, (req, res) => {
    res.json({ data: 'Protected data' });
});

// เพิ่ม session middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 } // กำหนดเวลาหมดอายุของ session (30 นาที)
}));

app.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.user = { username };
    res.json({ message: 'Login successful', session: req.session.user });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
