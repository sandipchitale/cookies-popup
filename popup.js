const cookiesTableBodyElement = document.getElementById('cookies-table-body');
const removeAllCookiesButton = document.getElementById('remove-all-cookies');

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.action.setBadgeText({
        tabId: tab.tabId,
        text: ''
    });

    const renderCookies = async (cookiesTableBodyElement, cookies) => {
        var rows = '';
        cookies.forEach((cookie, index) => {
            rows +=
                `<tr>`
                + `<td>${cookie.domain}</td>`
                + `<td>${cookie.path}</td>`
                + `<td><button id="remove-cookies-${index}" class="remove hidden"><b>X</b></button> ${cookie.name}</td>`
                + `<td>${cookie.httpOnly}</td>`
                + `<td>${cookie.secure}</td>`
                + `<td>${cookie.sameSite}</td>`
                + `<td>${cookie.session}</td>`
                + `<td title="${cookie.value}">${cookie.value}</td>`
                + `</tr>`;
        });
        cookiesTableBodyElement.innerHTML = rows;
    };

    const removeAllCookies = async () => {
        if (tab?.url) {
            let url = new URL(tab.url);
            const cookies = await chrome.cookies.getAll({domain: url.hostname});
            if (cookies) {
                cookies.forEach(async (cookie) => {
                    console.log(`${url.protocol}//${url.hostname}`);
                    console.log(`${cookie.name}`);
                    try {
                        await chrome.cookies.remove({
                            url: `${url.protocol}//${url.hostname}`,
                            name: cookie.name
                        });

                    } catch (e) {
                        console.error(e);
                    }
                })
            }   
        }
    };

    removeAllCookiesButton.addEventListener('click', () => {
        if (tab?.url) {
            let url = new URL(tab.url);
            if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
                if (confirm('Remove all Cookies?')) {
                    removeAllCookies();
                }
            } else {
                alert("Deletion of cookies supported only for localhost and 127.0.0.1");
            }
        }

    });

    if (tab?.url) {
        try {
            let url = new URL(tab.url);
            if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
                removeAllCookiesButton.style.visibility = 'visible';
            } else {
                removeAllCookiesButton.style.visibility = 'hidden';
            }
            const cookies = await chrome.cookies.getAll({domain: url.hostname});
            if (cookies.length === 0) {
                cookiesTableBodyElement.innerHTML = '<tr><td colspan="7"></td></tr>';
            } else {
                renderCookies(cookiesTableBodyElement, cookies);
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