const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Secure API proxy endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3001',
                'X-Title': process.env.SITE_NAME || 'Vastra Rent'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Chat service unavailable' });
    }
});

app.listen(PORT, () => {
    console.log(`VastraRent server running on port ${PORT}`);
});