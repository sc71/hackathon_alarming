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