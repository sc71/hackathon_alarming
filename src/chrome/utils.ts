export const getCurrentTabUrl = (callback: (url: string | undefined) => void): void => {
    const queryInfo = {active: true, lastFocusedWindow: true};

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        callback(tabs[0].url);
    });
}

export const getCurrentTabUId = (callback: (url: number | undefined) => void): void => {
    const queryInfo = {active: true, lastFocusedWindow: true};

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        callback(tabs[0].id);
    });
}

export const getCurrentTab = (callback: (string: string | undefined) => void): void => {
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs && chrome.tabs.query(queryOptions, tabs => {
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        callback(tabs[0].url);
  });
}

export const getCurrentTabWindowID = (callback: (windowId: string | undefined) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab && tab.windowId) {
        callback(String(tab.windowId)); // Convert the windowId to a string
        } else {
        callback(undefined);
        }
    });
};