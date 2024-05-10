window.onload = function() {
    // Fetch the Python file
    fetch('popup.py')
        .then(response => response.text())
        .then(text => {
            // Remove the old <py-script> tag
            const oldScript = document.querySelector('py-script');
            oldScript.parentNode.removeChild(oldScript);

            // Create a new <py-script> tag
            const newScript = document.createElement('py-script');
            newScript.textContent = text;

            // Add the new <py-script> tag to the body
            document.body.appendChild(newScript);
        });
};