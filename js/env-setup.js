// Environment Setup Guide for Production
// This file contains instructions for secure deployment

/*
=== PRODUCTION DEPLOYMENT GUIDE ===

1. For Node.js/Express Backend:
   - Create a .env file in your root directory
   - Add: OPENROUTER_API_KEY=your_actual_api_key_here
   - Install dotenv: npm install dotenv
   - In your server.js: require('dotenv').config();

2. For Static Hosting (Netlify, Vercel, etc.):
   - Add environment variable in hosting platform dashboard
   - Variable name: OPENROUTER_API_KEY
   - Variable value: your_actual_api_key_here

3. For Client-Side Security:
   - Never expose API keys in client-side code
   - Use a backend proxy endpoint instead
   - Example proxy endpoint:
*/

// Example backend proxy (Node.js/Express)
const express = require('express');
const app = express();

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.SITE_URL,
                'X-Title': process.env.SITE_NAME
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Chat service unavailable' });
    }
});

/*
4. Update config.js for production:
   - Change the API endpoint to your backend proxy
   - Remove the fallback API key
   - Use environment variables only

5. Security Checklist:
   ✓ API key stored in environment variables
   ✓ .env file added to .gitignore
   ✓ Backend proxy implemented
   ✓ Client-side API key removed
   ✓ HTTPS enabled
   ✓ CORS properly configured
*/