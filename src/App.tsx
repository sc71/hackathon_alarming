import React, { useEffect, useState } from 'react';
import { getCurrentTabUId, getCurrentTabWindowID, getCurrentTabUrl, getCurrentTab } from "./chrome/utils";
import './App.css';
import { collection, doc, addDoc, getDocs, setDoc, query, where, limit } from "firebase/firestore";
import { db } from './firebase';


//https://medium.com/litslink/how-to-create-google-chrome-extension-using-react-js-5c9e343323ff
function App() {
  const[url, setUrl] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [responseFromContent, setResponseFromContent] = useState("");

  useEffect(() => {
    getCurrentTabUrl((url) => {
      setUrl(url || 'undefined');
    })
  }, []);

  const addCurrentUrl = async () => {
    if (!loggedInEmail) return;
  
    getCurrentTab(async (url) => {
      if (!url) return;
      const blockedUrlsCollection = collection(db, "blockedUrls");
      const newDocRef = doc(blockedUrlsCollection);
      await setDoc(newDocRef, {
        email: loggedInEmail,
        url: url,
      });
    });
    setIsAdded(true);
  };
  
  const playSound = () => {
    const myAudio = new Audio();
    myAudio.src = chrome.runtime.getURL("./sounds/alarm-1-with-reverberation-30031.mp3")
    myAudio.play();
  }

  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [windowId, setWindowId] = useState<string | null>(null);
  useEffect(() => {
    getCurrentTabWindowID((windowId: string | undefined) => {
      if (windowId) {
        setWindowId(windowId);
      }
    });
  }, []);
  useEffect(() => {
    if (windowId !== null) {
      getLoggedInEmailFromStorage(windowId);
    }
  }, [windowId]);
  useEffect(() => {
    const handleWindowUnload = () => {
      if (windowId !== null) {
        chrome.storage.local.remove(`loggedInEmail-${windowId}`);
      }
    };
    window.addEventListener("unload", handleWindowUnload);
    return () => {
      window.removeEventListener("unload", handleWindowUnload);
    };
  }, [windowId]);

  const getLoggedInEmailFromStorage = (windowId: string) => {
    chrome.storage.local.get(`loggedInEmail-${windowId}`, (data) => {
      const loggedInEmail = data[`loggedInEmail-${windowId}`];
      if (loggedInEmail) {
        setEmailSaved(true);
        setLoggedInEmail(loggedInEmail);
        sendLoggedInEmailToBackground(loggedInEmail);
      } else {
        setEmailSaved(false);
      }
    });
  };

  const saveEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (windowId == null) return;
    try {
      const emailsCollection = collection(db, "emails");
      // Check if the email already exists in Firestore
      const emailQuery = query(
        emailsCollection,
        where("email", "==", email),
        limit(1)
      );
      const emailSnapshot = await getDocs(emailQuery);
      if (emailSnapshot.empty) {
        // Email doesn't exist, add it to Firestore
        await addDoc(emailsCollection, { email });
      }
      // Store the logged-in email in chrome.storage.local
      chrome.storage.local.set({ [`loggedInEmail-${windowId}`]: email }, () => {
        setEmailSaved(true);
        setLoggedInEmail(email);
        sendLoggedInEmailToBackground(email);
      });
    } catch (error) {
      console.error("Error saving email: ", error);
    }
  };

  // App.tsx
  const sendLoggedInEmailToBackground = (email: string | null) => {
    chrome.runtime.sendMessage({
      message: "updateLoggedInEmail",
      email,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {emailSaved ? (
            <p className = "curEmail">email saved: {loggedInEmail}</p>
          ) : (
            <form onSubmit={saveEmail}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email"
                required
              />
              <button type="submit">save email</button>
            </form>
          )}
        </p>

        <h2>you are currently at:</h2>
        <p className = "curURL">{url}</p>
        {isAdded ? (
        <p>website is in blocked list!</p>
      ) : (
        <button onClick={addCurrentUrl}>add to blocked list</button>
      )}
        {/* <button onClick={addCurrentUrl}>add to blocked list</button> */}
      </header>
    </div>
  );
}

export default App;
