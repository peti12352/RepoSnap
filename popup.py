from js import fetch, document, window, DOMParser, JSON, chrome, Promise
from xml.etree import ElementTree as ET


async def get_readme_content(repo_url):
    # Extract the owner and repo name from the URL
    if repo_url.endswith('/'):
        repo_url = repo_url[:-1]

    owner, repo = repo_url.split('/')[-2:]
    api_url = f'https://api.github.com/repos/{owner}/{repo}/readme'

    # Fetch the README content from the GitHub API
    response = await fetch(api_url)

    if response.status == 200:
        # Parse the JSON response
        readme_data = await response.json()
        readme_content = readme_data['content']

        # Decode the base64 encoded content
        return window.atob(readme_content)
    else:
        print("Error fetching README content from GitHub API.")
        return None


# Function to fetch Bash script from OpenAI's API using JavaScript's fetch API
def fetch_bash_script(readme_content):
    api_key = document.env.get('OPENAI_API_KEY')

    url = 'https://api.openai.com/v1/completions'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        'model': 'text-davinci-003',
        'prompt': f"Read the following GitHub README and create a Bash script for the user to set up the project:\n\n{readme_content}",
        'temperature': 0,
        'max_tokens': 1000,
    }

    # Use fetch API to send the request to OpenAI API
    fetch_promise = window.fetch(url, {
        'method': 'POST',
        'headers': headers,
        'body': JSON.stringify(data),
    })

    def handle_response(response):
        if response.ok:
            return response.json()
        else:
            print("Error fetching Bash script from OpenAI API.")
            return None

    def handle_json_response(json_response):
        if json_response:
            script_content = json_response['choices'][0]['text']
            document.getElementById('bash-script').value = script_content

    fetch_promise.then(handle_response).then(handle_json_response)

# Function to handle copying the script to the clipboard


def copy_script():
    bash_script = document.getElementById('bash-script')
    bash_script.select()
    document.execCommand('copy')
    print("Script copied to clipboard!")


# Set up event listener for copy button
document.getElementById('copy-button').addEventListener('click', copy_script)


# Main function to execute the process
async def main():
    print("Executing main function...")
    # Define a JavaScript Promise that gets the active tab

    def get_active_tab(resolve, reject):
        def callback(tabs):
            if tabs and len(tabs) > 0:
                resolve(tabs[0].url)
                print('Active tab URL:', tabs[0].url)
            else:
                reject('No active tab found')
                print('No active tab found')

        chrome.tabs.query({'active': True, 'currentWindow': True}, callback)

    # Create a Python Promise that wraps the JavaScript Promise
    repo_url_promise = Promise.new(get_active_tab)

    # Wait for the Promise to resolve with the URL of the active tab
    repo_url = await repo_url_promise

    # Fetch the README content
    readme_content = await get_readme_content(repo_url)

    if readme_content:
        fetch_bash_script(readme_content)

main()