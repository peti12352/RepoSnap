function requestCurrentTabUrl() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                resolve(tabs[0].url);
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
        document.getElementById('status').textContent = 'Fetching README content...';
        const currentUrl = await requestCurrentTabUrl();
        const { owner, repo } = extractOwnerAndRepoFromURL(currentUrl);
        const readmeContent = await fetchReadmeContent(owner, repo);

        if (readmeContent) {
            document.getElementById('status').textContent = 'Generating script...';
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

document.addEventListener('DOMContentLoaded', () => {
    const generateScriptButton = document.getElementById('generate-script-button');
    const copyButton = document.getElementById('copy-button');

    if (generateScriptButton) {
        generateScriptButton.addEventListener('click', () => {
            fetchAndGenerateScript();
        });
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const scriptTextarea = document.getElementById('bash-script');
            scriptTextarea.select();
            document.execCommand('copy');
            document.getElementById('status').textContent = 'Script copied to clipboard!';
        });
    }
});
