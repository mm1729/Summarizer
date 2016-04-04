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
        callback(tab, url);
    });
}

/**
    Adds summary html to popup.html page
    Hides Action Div

    @param {string} summary - html "summary" to be added
*/
function addSummarytoPage(title, summary) {
    summaryPage();
    document.getElementById('summary').innerHTML = '<b>' + title + '</b>';
    for(p in summary)
        document.getElementById('summary').innerHTML +=
            '<p>' + summary[p] + '</p>';
}


function processPage() {
    getCurrentTabUrl(function(tab, url) {
        chrome.tabs.sendMessage(tab.id, {"message": "extract_text"},
            function(res){
                var title = res.titleNode;
                var article = res.all_text.join('\n')
                var summary = summarize(title, article);
                addSummarytoPage(title, summary);
                saveSummary(title, summary, url);
            });
    });
}

function historyPage() {
    document.getElementById('action').style.display = 'none';
    document.getElementById('summary').style.display = 'none';
    document.getElementById('history-table').style.display = 'inline-block';
}

function mainPage() {
    document.getElementById('action').style.display = 'inline-block';
    document.getElementById('summary').style.display = 'none';
    document.getElementById('history-table').style.display = 'none';
}

function summaryPage() {
    document.getElementById('action').style.display = 'none';
    document.getElementById('summary').style.display = 'inline-block';
    document.getElementById('history-table').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('this-page').addEventListener('click', processPage);
    document.getElementById('history').addEventListener('click', historyPage);
    document.getElementById('title').addEventListener('click', mainPage);
    mainPage();
});


// History methods

function saveSummary(title, summary, url) {
    var newData = {"title" : title || "no title", "summary" : summary, "url" : url};
    chrome.storage.sync.get("data", function (obj) {
        obj = (obj == {}) ? {'all' : [data]} : obj.all.push(data);
        chrome.storage.sync.set(obj, function() {
              // Notify that we saved.
              console.log('Settings saved');
        });
    });
    /*chrome.storage.sync.set({'value': 23}, function() {
          // Notify that we saved.
          message('Settings saved');
    });*/

}
