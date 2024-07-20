const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enables CORS for all origins

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/completions';

app.post('/generate-bash-script', async (req, res) => {
    const { readme } = req.body;

    if (!readme) {
        return res.status(400).json({ error: 'README content is required' });
    }

    try {
        const response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                prompt: `Generate a bash script for the following GitHub README content:\n\n${readme}`,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            res.json({ script: data.choices[0].text.trim() });
        } else {
            res.status(response.status).json({ error: response.statusText });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
