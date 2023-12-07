const cookiesElement = document.getElementById('cookies');

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    if (tab?.url) {
        try {
            let url = new URL(tab.url);
            const cookies = await chrome.cookies.getAll({domain: url.hostname});
            if (cookies.length === 0) {
                cookiesElement.innerText = 'No cookies found';
            } else {
                cookiesElement.innerText = JSON.stringify(cookies, null, '  ');
            }
        } catch {
            // ignore
        }
    }
})();