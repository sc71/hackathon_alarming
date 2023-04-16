import React, { useEffect, useState } from 'react';
//import { ChromeMessage, Sender } from "./types";
import { getCurrentTabUId, getCurrentTabUrl, getCurrentTab } from "./chrome/utils";
import './App.css';
// import { query } from 'express';

//https://medium.com/litslink/how-to-create-google-chrome-extension-using-react-js-5c9e343323ff
function App() {
  const[url, setUrl] = useState("");
  const [responseFromContent, setResponseFromContent] = useState("");

  useEffect(() => {
    getCurrentTabUrl((url) => {
      setUrl(url || 'undefined');
    })
  }, []);

  const addCurrentUrl = () => {
    getCurrentTab((url) => {
      //TODO add url to firebase
    });
  }
  
  const playSound = () => {
    const myAudio = new Audio();
    myAudio.src = chrome.runtime.getURL("./sounds/alarm-1-with-reverberation-30031.mp3")
    myAudio.play();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>You are currently at:</h2>
        <p>{url}</p>
        <button onClick={addCurrentUrl}>ADD TO BLOCKED LIST</button>
      </header>
    </div>
  );
}

export default App;
