/**
 * Content script for the extension
 * Mainly deals with replacing words on the page
 */

replaceFromStorage();

/**
 * Listen for messages from the popup/background script
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
    /**
     * Add, update, or remove a word
     */
    if (message[0] === 0 || message[0] === 1 || message[0] === 2) {
        replaceFromArray([[message[1], message[2]]]);
    }

    /**
     * Clear all
     */
    if(message[0] === 3){
        replaceFromArray(message[1]);
    }
});

/**
 * Replace words on page, using the words currently in storage
 */
function replaceFromStorage(){
    chrome.runtime.sendMessage([14], function(response){
        replace(response.list);
    });
}

/**
 * Replace words on page based on the arguement
 * @param words words to be replaced on page
 */
function replaceFromArray(words){
    if(words !== []) {
        replace(words);
    }
}

/**
 * Replace given words on page
 * @param words words to be replaced
 */
function replace(words){
    let nodes = getTextNodes();
    for(let node of nodes){
        let text = node.nodeValue;
        for(let pair of words) {
            let testReg = /^[A-Za-z]*$/;
            if (testReg.test(pair[0])){
                let regex = new RegExp('\\b'+pair[0]+'\\b', 'gi');
                text = text.replace(regex, pair[1]);
            }
            else{
                text = text.replace(pair[0], pair[1]);
            }
        }
        node.nodeValue = text;
    }
}

/**
 * Get all text nodes on a page
 * @returns {Array} text nodes on the page
 */
function getTextNodes(){
    let treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let textNodes = [];
    while(node = treeWalker.nextNode()) {
        textNodes.push(node);
    }

    return textNodes;
}
