(async () => {
    const updateBadge = async (tab) => {
            if (tab?.url) {
                let url = new URL(tab.url);
                const cookies = await chrome.cookies.getAll({domain: url.hostname});
                if (cookies) {
                    chrome.action.setBadgeBackgroundColor({
                        tabId: tab.tabId,
                        color: cookies.length === 0 ? [255, 255, 255, 0] : [255, 0, 0, 255]
                    });
                    chrome.action.setBadgeText({
                        tabId: tab.tabId,
                        text: cookies.length === 0 ? '' : `${cookies.length}`
                    });
                }
            }
        };
    chrome.cookies.onChanged.addListener(
        async (changeInfo) => {
            let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            if (tab?.url) {
                chrome.action.setBadgeText({
                    tabId: tab.tabId,
                    text: ''
                });
                chrome.action.setBadgeBackgroundColor({
                    tabId: tab.tabId,
                    color: [255, 255, 255, 0]
                });
                chrome.action.setBadgeTextColor({
                    tabId: tab.tabId,
                    color: 'white'
                });
                chrome.action.setBadgeText({
                    tabId: tab.tabId,
                    text: '...'
                });
                setTimeout(() => {
                    updateBadge(tab);
                }, 1000);
            }
        });
})();