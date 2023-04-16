import { getCurrentTabUId, getCurrentTabUrl } from "./utils";
import { ChromeMessage, Sender } from "../types";
import { getCurrentTab } from "./utils";

export {}
/** Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version. */
const blocked = ["netflix.com", "instagram.com", "twitter.com"];
const sendRemoveAllMessage = () => {
        (getCurrentTab((tab) => {
            const message: ChromeMessage = {
                from: Sender.React,
                message: "remove all",
                }
                getCurrentTabUId((id) => {
                    id && chrome.tabs.sendMessage(
                    id,
                    message,
                    (response) => {});
                });
        }))
    };

const playAudio = () => {
    const myAudio = new Audio(chrome.runtime.getURL("alarming/src/chrome/sounds/alarm-1-with-reverberation-30031.mp3"));
    myAudio.play();
}

chrome.runtime.onInstalled.addListener((details) => {
    console.log('[background.js] onInstalled', details);
    //alert('[background.js] onInstalled');
});

chrome.runtime.onConnect.addListener((port) => {
    console.log('[background.js] onConnect', port)
    //alert('[background.js] onInstalled');
});

chrome.runtime.onStartup.addListener(() => {
    console.log('[background.js] onStartup')
    //alert('[background.js] onInstalled');
});

chrome.tabs.onActivated.addListener(() => {
    const queryOptions = {active: true, lastFocusedWindow: true};
    getCurrentTab((tab) => {
        for (let i = 0; i < blocked.length; i++) {
            if (tab?.includes(blocked[i])) {
                sendRemoveAllMessage();
                playAudio();
                break;
            }
          }
    })
});

chrome.tabs.onUpdated.addListener(() => {
    const queryOptions = {active: true, lastFocusedWindow: true};
    getCurrentTab((tab) => {
        for (let i = 0; i < blocked.length; i++) {
            if (tab?.includes(blocked[i])) {
                sendRemoveAllMessage();
                playAudio();
                break;
            }
          }
    })
});

/**
 *  Sent to the event page just before it is unloaded.
 *  This gives the extension opportunity to do some clean up.
 *  Note that since the page is unloading,
 *  any asynchronous operations started while handling this event
 *  are not guaranteed to complete.
 *  If more activity for the event page occurs before it gets
 *  unloaded the onSuspendCanceled event will
 *  be sent and the page won't be unloaded. */
chrome.runtime.onSuspend.addListener(() => {
    console.log('[background.js] onSuspend')
    //alert('[background.js] onSuspend');
});