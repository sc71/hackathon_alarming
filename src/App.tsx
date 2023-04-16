import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { ChromeMessage, Sender } from "./types";
import { getCurrentTabUId, getCurrentTabUrl } from "./chrome/utils";
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
  
  const sendRemoveMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "delete logo",
    }

    getCurrentTabUId((id) => {
        id && chrome.tabs.sendMessage(
          id,
          message,
          (response) => {
            setResponseFromContent(responseFromContent);
          });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>URL:</p>
        <p>
          {url}
        </p>
        <button onClick={sendTestMessage}>SEND MESSAGE</button>
        <button onClick={sendRemoveMessage}>Remove logo</button>
        <p>Response from content:</p>
        <p>
          {responseFromContent}
        </p>
      </header>
    </div>
  );
}

export default App;
