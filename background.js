chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'get_current_tab_url') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                sendResponse({ url: tabs[0].url });
            } else {
                sendResponse({ url: null });
            }
        });
        return true;  // Indicates that sendResponse will be called asynchronously
    }

    if (message.action === 'generate_bash_script') {
        fetch('http://localhost:3000/generate-bash-script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ readme: message.readme }),
        })
        .then(response => response.json())
        .then(data => sendResponse({ script: data.script }))
        .catch(error => {
            console.error('Failed to get bash script from server:', error);
            sendResponse({ script: null });
        });
        return true;  // Indicates that sendResponse will be called asynchronously
    }
});
