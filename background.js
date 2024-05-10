// Listener for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle request for the current tab URL
    if (message.action === 'get_current_tab_url') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                sendResponse({ url: tabs[0].url });
            } else {
                sendResponse({ url: null });
            }
        });
        // Indicate that the response will be asynchronous
        return true;
    }
    
    // Handle request to generate Bash script from README content
    if (message.type === 'generateBashScript') {
        const { readme } = message;

        // Generate Bash script using the provided README content
        getBashScript(readme)
            .then((bashScript) => {
                sendResponse({ bashScript });
            })
            .catch((error) => {
                console.error('Error generating Bash script:', error);
                sendResponse({ bashScript: null });
            });

        // Indicate that the response will be asynchronous
        return true;
    }
});

// Import OpenAI library and API key
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI with API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate Bash script using OpenAI API
async function getBashScript(readme) {
    const apiKey = openai.apiKey;
    const url = 'https://api.openai.com/v1/completions'; // API endpoint for OpenAI completions

    // Construct the prompt
    const prompt = `Is it possible to generate a bash script for the following GitHub README content:\n\n`; // ${readme}

    try {
        // Make a POST request to the OpenAI API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Use the specified model
                prompt: prompt,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        // Handle the API response
        if (response.ok) {
            const data = await response.json();
            // Return the generated Bash script
            return data.choices[0].text.trim();
        } else {
            console.error('Failed to get Bash script from OpenAI API:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error during API request:', error);
        return null;
    }
}
