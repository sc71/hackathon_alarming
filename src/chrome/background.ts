import { getCurrentTabUId, getCurrentTabUrl } from "./utils";
import { ChromeMessage, Sender } from "../types";
import { getCurrentTab } from "./utils";
import { query, collection, onSnapshot, where, limit } from "firebase/firestore";
import { db } from './../firebase';

export {}
/** Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version. */
let blocked = ["netflix.com", "instagram.com", "twitter.com"];

let loggedInEmail: string | null = null;

const updateLoggedInEmail = (email: string | null) => {
  loggedInEmail = email;
  fetchBlockedUrls();
};

const fetchBlockedUrls = async () => {
    if (loggedInEmail) {
      const blockedUrlsCollection = collection(db, "blockedUrls");
      const filteredBlockedUrls = query(
        blockedUrlsCollection,
        where("email", "==", loggedInEmail)
      );
      onSnapshot(filteredBlockedUrls, (snapshot) => {
        const newBlockedUrls = snapshot.docs.map((doc) => doc.data().url);
        blocked = Array.from(new Set([...blocked, ...newBlockedUrls]));
      });
    }
};
  

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

// background.ts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "updateLoggedInEmail") {
        updateLoggedInEmail(request.email);
    }
});
  

const myAudio = new Audio();
myAudio.src = chrome.runtime.getURL("./sounds/alarm-1-with-reverberation-30031.mp3");
myAudio.loop = true;

const playSound = () => {
    if (myAudio.paused) {
      myAudio.play();
    }
  }

let activeTab: number | undefined;

chrome.tabs.onActivated.addListener(() => {
    const queryOptions = { active: true, lastFocusedWindow: true };
    getCurrentTab((tab) => {
      for (let i = 0; i < blocked.length; i++) {
        if (tab?.includes(blocked[i])) {
          getCurrentTabUId((currentID) => {
            activeTab = currentID;
          });
          sendRemoveAllMessage();
          playSound();
          break;
        }
      }
    });
});
  


chrome.tabs.onUpdated.addListener(() => {
    const queryOptions = {active: true, lastFocusedWindow: true};
    getCurrentTab((tab) => {
        for (let i = 0; i < blocked.length; i++) {
            if (tab?.includes(blocked[i])) {
                getCurrentTabUId((currentID) => {
                    activeTab = currentID;
                })
                sendRemoveAllMessage();
                playSound();
                break;
            }
        }
    })
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (activeTab && tabId === activeTab) {
        myAudio.pause();
        myAudio.currentTime = 0;
    }
});

// chrome.tabs.onActivated.addListener(() => {
//     const queryOptions = {active: true, lastFocusedWindow: true};
//     getCurrentTab((tab) => {
//         for (let i = 0; i < blocked.length; i++) {
//             if (tab?.includes(blocked[i])) {
//                 sendRemoveAllMessage();
//                 playSound();
//                 break;
//             }
//           }
//     })
// });


// chrome.tabs.onUpdated.addListener(() => {
//     const queryOptions = {active: true, lastFocusedWindow: true};
//     getCurrentTab((tab) => {
//         for (let i = 0; i < blocked.length; i++) {
//             if (tab?.includes(blocked[i])) {
//                 sendRemoveAllMessage();
//                 playSound();
//                 break;
//             }
//           }
//     })
// });

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