/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
 function getCurrentTabUrl(callback) {
    var queryInfo = {
        active : true,
        currentWindow : true
    }

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;

        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(url);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('this-page').onClick =
    getCurrentTabUrl(function(url) {
            //chrome.tabs.create({url: url});
        }
    );
});
