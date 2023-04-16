import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { ChromeMessage, Sender } from "./types";
import { getCurrentTabUId, getCurrentTabUrl, getCurrentTab } from "./chrome/utils";
import './App.css';
import { query } from 'express';

//https://medium.com/litslink/how-to-create-google-chrome-extension-using-react-js-5c9e343323ff
function App() {
  const[url, setUrl] = useState("");
  const [responseFromContent, setResponseFromContent] = useState("");

  useEffect(() => {
    getCurrentTabUrl((url) => {
      setUrl(url || 'undefined');
    })
  }, []);

  const sendTestMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "Hello from React",
    }

    getCurrentTabUId((id) => {
      id && chrome.tabs.sendMessage(
        id,
        message,
        (responseFromContent) => {
          setResponseFromContent(responseFromContent);
        });
    });
  };

  const addCurrentUrl = () => {
    getCurrentTab((url) => {
      //TODO add url to firebase
    });
  }
  
  const playSound = () => {
    const myAudio = new Audio(chrome.runtime.getURL("./chrome/sounds/alarm-1-with-reverberation-30031.mp3"));
    myAudio.play();
  }
  
  // const sendRemoveMessage = () => {
  //   const message: ChromeMessage = {
  //     from: Sender.React,
  //     message: "delete logo",
  //   }

  //   getCurrentTabUId((id) => {
  //       id && chrome.tabs.sendMessage(
  //         id,
  //         message,
  //         (response) => {
  //           setResponseFromContent(responseFromContent);
  //         });
  //   });
  // };

  // const sendRemoveAllMessage = () => {
  //   for (let i = 0; i < blocked.length; i++) {
  //     if (url.includes(blocked[i])) {
  //       const message: ChromeMessage = {
  //         from: Sender.React,
  //         message: "remove all",
  //       }
  //       getCurrentTabUId((id) => {
  //           id && chrome.tabs.sendMessage(
  //             id,
  //             message,
  //             (response) => {
  //               setResponseFromContent(responseFromContent);
  //             });
  //       });
  //     }
  //   }
  // };

  return (
    <div className="App">
      <header className="App-header">
        <p>URL:</p>
        <p>
          {url}
        </p>
        <button onClick={addCurrentUrl}>Add Current URL to Blocked List</button>
        {/* <button onClick={sendRemoveMessage}>Remove logo</button>
        <button onClick={sendRemoveAllMessage}>Remove all</button> */}
        <button onClick={playSound}>Play Sound</button>
        <p>Response from content:</p>
        <p>
          {responseFromContent}
        </p>
      </header>
    </div>
  );
}

export default App;
