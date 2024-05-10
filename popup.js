document.getElementById('generate-script-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Send message to the content script to generate the script
        chrome.tabs.sendMessage(tabs[0].id, { type: 'generateScript' }, (response) => {
            if (chrome.runtime.lastError) {
                document.getElementById('status').textContent = 'Error: ' + chrome.runtime.lastError.message;
                return;
            }

            if (response && response.script) {
                document.getElementById('bash-script').value = response.script;
                document.getElementById('status').textContent = 'Script generated!';
            } else {
                document.getElementById('status').textContent = 'Failed to generate script.';
            }
        });
    });
});

// Copy the script to clipboard
document.getElementById('copy-button').addEventListener('click', () => {
    const scriptTextarea = document.getElementById('bash-script');
    scriptTextarea.select();
    document.execCommand('copy');
    document.getElementById('status').textContent = 'Script copied to clipboard!';
});
