const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.post('/log-session', (req, res) => {
    const { sessionData, userData, message } = req.body;

    if (message) {
        console.log('--- Notification ---');
        console.log(message);
    } else {
        console.log('--- User Session Data ---');
        console.log('User Data:', userData);
        console.log('Session Data:', sessionData);
        console.log('-------------------------');
    }

    res.json({ message: 'Session data or logout notification logged successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});