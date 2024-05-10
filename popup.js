// When the "Generate Script" button is clicked
document.getElementById('generate-script-button').addEventListener('click', () => {
    // Get the active tab and send a message to generate the script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Send a message to the content script to generate the script
        chrome.tabs.sendMessage(activeTab.id, { type: 'generateScript' }, (response) => {
            if (chrome.runtime.lastError) {
                document.getElementById('status').textContent = 'Error: ' + chrome.runtime.lastError.message;
                return;
            }

            // Display the generated Bash script in the text box
            if (response && response.bashScript) {
                document.getElementById('bash-script').value = response.bashScript;
                document.getElementById('status').textContent = 'Script generated successfully!';
            } else {
                document.getElementById('status').textContent = 'Failed to generate script.';
            }
        });
    });
});

// Copy the script to the clipboard when the "Copy Script" button is clicked
document.getElementById('copy-button').addEventListener('click', () => {
    const scriptTextarea = document.getElementById('bash-script');
    scriptTextarea.select();
    document.execCommand('copy');
    document.getElementById('status').textContent = 'Script copied to clipboard!';
});
