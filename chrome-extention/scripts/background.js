chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'generate_bash_script') {
        console.log('Request to generate bash script received');

        fetch('http://localhost:3000/generate-bash-script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ readme: message.readme }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }
            return response.text(); // Receive plain text
        })
        .then(script => {
            console.log('Bash script received from server:', script);
            sendResponse({ script });
        })
        .catch(error => {
            console.error('Failed to get bash script from server:', error);
            sendResponse({ script: null });
        });
        return true; // Keeps the message channel open for async response
    }
});
