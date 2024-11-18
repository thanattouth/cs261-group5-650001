const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});