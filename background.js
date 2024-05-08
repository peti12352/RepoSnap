chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === "get_active_tab") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var active_tab = tabs[0];
          sendResponse({url: active_tab.url});
        });
        return true;  // Will respond asynchronously.
      }
    });