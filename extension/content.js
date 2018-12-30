chrome.storage.local.clear()
replaceFromStorage();

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse){
    add_vocab(message[0], message[1]);
}