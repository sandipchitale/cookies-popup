(async () => {
    const updateBadge = async () => {
            let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            chrome.action.setBadgeText({
                tabId: tab.tabId,
                text: ''
            });
            let url = new URL(tab.url);
            const cookies = await chrome.cookies.getAll({domain: url.hostname});
            if (cookies) {
                chrome.action.setBadgeText({
                    tabId: tab.tabId,
                    text: `${cookies.length}`
                });
            }
        };
    chrome.cookies.onChanged.addListener(
        async (changeInfo) => {
            setTimeout(updateBadge, 1000);
        });
})();