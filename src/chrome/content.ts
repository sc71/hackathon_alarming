import { ChromeMessage, Sender } from "../types";

type MessageResponse = (response?: any) => void

const validateSender = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender
) => {
    return sender.id === chrome.runtime.id && message.from === Sender.React;
}

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: MessageResponse
) => {

    const isValidated = validateSender(message, sender);

    if (isValidated && message.message === "remove all") {
        // const allElements = document.querySelectorAll("*");
        // allElements.forEach((element) => {
        //     element?.parentElement?.removeChild(element);
        // });
        const htmlString = `<html>
        <head>
            <style>
            body {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
            .flash {
                width: 100vw;
                height: 100vh;
                position: absolute;
                top: 0;
                left: 0;
                animation: flash 0.5s infinite;
            }
            @keyframes flash {
                0% { background-color: #FF0000; }
                25% { background-color: #00FF00; }
                50% { background-color: #0000FF; }
                75% { background-color: #FFFF00; }
                100% { background-color: #FF00FF; }
            }
            </style>
        </head>
        <body>
            <div class="flash"></div>
        </body>
        </html>`;

        document.documentElement.innerHTML = htmlString;
    }
}

const main = () => {
    console.log('[content.ts] Main')
    /**
     * Fired when a message is sent from either an extension process or a content script.
     */
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
}

main();