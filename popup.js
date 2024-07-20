document.getElementById('generate-script-button').addEventListener('click', () => {
    chrome.storage.local.get('generatedScript', (result) => {
        const script = result.generatedScript || '';
        if (script) {
            document.getElementById('bash-script').value = script;
            document.getElementById('status').textContent = 'Script generated!';
        } else {
            document.getElementById('status').textContent = 'Failed to generate script.';
        }
    });
});

// Copy the script to clipboard
document.getElementById('copy-button').addEventListener('click', () => {
    const scriptTextarea = document.getElementById('bash-script');
    scriptTextarea.select();
    document.execCommand('copy');
    document.getElementById('status').textContent = 'Script copied to clipboard!';
});
