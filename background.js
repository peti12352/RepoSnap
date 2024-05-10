chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
});



async function getBashScript(readme) {
    const apiKey = ''; // Replace with your OpenAI API key
    const url = 'https://api.openai.com/v1/completions';

    // Construct the prompt
    const prompt = `Generate a bash script for the following GitHub README content:\n\n${readme}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                prompt: prompt,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.choices[0].text.trim();
        } else {
            console.error('Failed to get bash script from ChatGPT:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error during API request:', error);
        return null;
    }
}
