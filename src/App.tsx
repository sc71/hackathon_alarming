import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { ChromeMessage, Sender } from "./types";
import './App.css';
import { query } from 'express';

function App() {
  const[url, setUrl] = useState("");
  const [responseFromContent, setResponseFromContent] = useState("");

  useEffect(() => {
    const queryInfo = {active: true, lastFocusedWindow: true};
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const url = "" + tabs[0].url;
      setUrl(url);
    });
  }, []);

  const sendTestMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      mesage: "Hello from React",
    }

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true
    };

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const currentTabId = tabs[0].id;

      chrome.tabs.sendMessage(
        currentTabId,
        message,
        (response) => {
          setResponseFromContent(response);
        });
    });
  };
  
  const sendRemoveMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "delete logo",
    }

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true
    };

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const currentTabId = tabs[0].id;
      chrome.tabs.sendMessage(
        currentTabId,
        message,
        (response) => {
          setResponseFromContent(response);
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
