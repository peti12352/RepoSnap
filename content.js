// Function to request current tab URL from the background script
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

// Function to extract owner and repository from the current GitHub URL
function extractOwnerAndRepoFromURL(url) {
    // Remove trailing slash if present
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    
    // Split the URL and extract the owner and repo from the end
    const parts = url.split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    
    return { owner, repo };
}

// Function to fetch README content from a raw GitHub URL
async function getReadmeContentFromRawUrl(owner, repo) {
    // Construct the raw URL for the README file
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;

    // Get the text content from the raw URL
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

// Example usage: Fetch README content based on the active site URL
async function fetchAndHandleReadmeContent() {
    try {
        // Request the current tab's URL
        const currentUrl = await requestCurrentTabUrl();

        // Extract owner and repo from the URL
        const { owner, repo } = extractOwnerAndRepoFromURL(currentUrl);

        // Fetch README content using the raw URL
        const readmeContent = await getReadmeContentFromRawUrl(owner, repo);

        if (readmeContent) {
            console.log('Fetched README content:', readmeContent);
            // You can now use the readmeContent as needed in your extension
        }
    } catch (error) {
        console.error('Failed to fetch README content:', error);
    }
}

// Call the function to fetch README content
fetchAndHandleReadmeContent();
