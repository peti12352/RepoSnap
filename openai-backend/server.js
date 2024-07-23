const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post('/generate-bash-script', async (req, res) => {
    const promptBeginning = fs.readFileSync('/prompts/p1.txt', 'utf8');
    const { readme } = req.body;

    if (!readme) {
        console.log('README content is required');
        return res.status(400).json({ error: 'README content is required' });
    }

    else {
        console.log('Request to generate bash script received');
    }

    try {
        const response = await axios.post(openaiEndpoint, {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',

                    // concat the prompt.txt and the readme for the content
                    content: `${promptBeginning}\n${readme}`
                }
            ],
            max_tokens: 500,
            temperature: 0.5
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const script = response.data.choices[0]?.message?.content?.trim() || '';
        res.send(script);
    } catch (error) {
        console.error('Error making request to OpenAI:', error);
        res.status(500).send('Error retrieving the bash script');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
