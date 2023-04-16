import { getCurrentTabUId, getCurrentTabUrl } from "./utils";
import { ChromeMessage, Sender } from "../types";
import { getCurrentTab } from "./utils";
import { query, collection, onSnapshot, where, limit } from "firebase/firestore";
import { db } from './../firebase';

export {}
/** Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version. */

let loggedInEmail: string | null = null;

const updateLoggedInEmail = (email: string | null) => {
  loggedInEmail = email;
  fetchBlockedUrls();
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
// Replace the blocked array with an object keyed by email
let blocked: { [email: string]: string[] } = {};

const fetchBlockedUrls = async () => {
  if (loggedInEmail) {
    const blockedUrlsCollection = collection(db, "blockedUrls");
    const filteredBlockedUrls = query(
      blockedUrlsCollection,
      where("email", "==", loggedInEmail)
    );
    onSnapshot(filteredBlockedUrls, (snapshot) => {
      // Update the blocked object with the fetched URLs for the logged-in email
      if (loggedInEmail) blocked[loggedInEmail] = snapshot.docs.map((doc) => doc.data().url);
    });
  } else {
    // Remove the blocklist for the email when no user is logged in
    if (loggedInEmail) {
      delete blocked[loggedInEmail];
    }
  }
};

chrome.tabs.onActivated.addListener(() => {
    const queryOptions = { active: true, lastFocusedWindow: true };
    getCurrentTab((tab) => {
      if (loggedInEmail && blocked[loggedInEmail]) {
        for (let i = 0; i < blocked[loggedInEmail].length; i++) {
          if (tab?.includes(blocked[loggedInEmail][i])) {
            getCurrentTabUId((currentID) => {
              activeTab = currentID;
            });
            sendRemoveAllMessage();
            playSound();
            break;
          }
        }
      }
    });
  });
  
  chrome.tabs.onUpdated.addListener(() => {
    const queryOptions = { active: true, lastFocusedWindow: true };
    getCurrentTab((tab) => {
      if (loggedInEmail && blocked[loggedInEmail]) {
        for (let i = 0; i < blocked[loggedInEmail].length; i++) {
          if (tab?.includes(blocked[loggedInEmail][i])) {
            getCurrentTabUId((currentID) => {
              activeTab = currentID;
            });
            sendRemoveAllMessage();
            playSound();
            break;
          }
        }
      }
    });
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


chrome.tabs.onRemoved.addListener((tabId) => {
    if (activeTab && tabId === activeTab) {
        myAudio.pause();
        myAudio.currentTime = 0;
    }
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