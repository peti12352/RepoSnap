function requestCurrentTabUrl() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'get_current_tab_url' }, (response) => {
            if (response && response.url) {
                resolve(response.url);
            } else {
                reject(new Error('Could not retrieve current tab URL'));
            }
        });
    });
}

function extractOwnerAndRepoFromURL(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    
    const parts = url.split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    
    return { owner, repo };
}

async function fetchReadmeContent(owner, repo) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
    
    try {
        const response = await fetch(rawUrl);
        if (response.ok) {
            return await response.text();
        } else {
            console.error('Failed to fetch README content:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return null;
    }
}

async function fetchAndGenerateScript() {
    try {
        const currentUrl = await requestCurrentTabUrl();
        const { owner, repo } = extractOwnerAndRepoFromURL(currentUrl);
        const readmeContent = await fetchReadmeContent(owner, repo);

        if (readmeContent) {
            chrome.runtime.sendMessage({ action: 'generate_bash_script', readme: readmeContent }, (response) => {
                if (response && response.script) {
                    document.getElementById('bash-script').value = response.script;
                    document.getElementById('status').textContent = 'Script generated!';
                } else {
                    document.getElementById('status').textContent = 'Failed to generate script.';
                }
            });
        } else {
            document.getElementById('status').textContent = 'Failed to fetch README content.';
        }
    } catch (error) {
        console.error('Error in fetch and generate script:', error);
        document.getElementById('status').textContent = 'Error in fetch and generate script.';
    }
}

// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-script-button');
    if (generateButton) {
        generateButton.addEventListener('click', fetchAndGenerateScript);
    } else {
        console.error('Generate script button not found.');
    }

    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const scriptTextarea = document.getElementById('bash-script');
            if (scriptTextarea) {
                scriptTextarea.select();
                document.execCommand('copy');
                document.getElementById('status').textContent = 'Script copied to clipboard!';
            } else {
                console.error('Bash script textarea not found.');
            }
        });
    } else {
        console.error('Copy button not found.');
    }
});
