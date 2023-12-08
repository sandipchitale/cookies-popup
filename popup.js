const cookiesTableBodyElement = document.getElementById('cookies-table-body');

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.action.setBadgeText({
        tabId: tab.tabId,
        text: ''
    });
    if (tab?.url) {
        try {
            let url = new URL(tab.url);
            const cookies = await chrome.cookies.getAll({domain: url.hostname});
            if (cookies.length === 0) {
                cookiesTableBodyElement.innerHTML = '<tr><td colspan="7"></td></tr>';
            } else {
                var rows = '';
                cookies.forEach((cookie) => {
                    rows +=
                        `<tr>`
                        + `<td>${cookie.domain}</td>`
                        + `<td>${cookie.name}</td>`
                        + `<td>${cookie.httpOnly}</td>`
                        + `<td>${cookie.secure}</td>`
                        + `<td>${cookie.sameSite}</td>`
                        + `<td>${cookie.session}</td>`
                        + `<td title="${cookie.value}">${cookie.value}</td>`
                        + `</tr>`;
                });
                cookiesTableBodyElement.innerHTML = rows;
            }
            if (cookies) {
                chrome.action.setBadgeBackgroundColor({
                    tabId: tab.tabId,
                    color: cookies.length === 0 ? [255, 255, 255, 0] : [255, 0, 0, 255]
                });
                chrome.action.setBadgeTextColor({
                    tabId: tab.tabId,
                    color: 'white'
                });
                chrome.action.setBadgeText({
                    tabId: tab.tabId,
                    text: cookies.length === 0 ? '' : `${cookies.length}`
                });
            }
        } catch {
            // ignore
        }
    }
})();