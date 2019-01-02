//chrome.storage.local.clear();
replaceFromStorage();
prepareVocab();

let vocabWords = [];
let removedWords = [];
let tempVocab;
let useTemp = false;

/**
 * Listen for messages from the popup
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){

    /**
     * Set the vocab words
     */
    if(message.length === 1 && message[0] === 0){
        prepareVocab();

        if(vocabWords !== undefined){
            if(useTemp){
                for(let element of tempVocab) {
                    vocabWords.push(element);
                }
                useTemp = false;
            }
            removeVocabWords();
            sendResponse({list: vocabWords});
        }
        else{
            if(useTemp){
                vocabWords = tempVocab;
                useTemp = false;
            }
            removeVocabWords();
            sendResponse({list: vocabWords});
        }
    }

    /**
     * Clear all
     */
    if(message.length === 1 && message[0] === 3){
        removeAll();
        chrome.storage.local.clear();
        vocabWords = [];
        removedWords = [];
        tempVocab = [];
        useTemp = false;
    }

    /**
     * Add a word
     */
    if (typeof message === 'object' && message.length === 3 && message[2] === 0) {
        if(!useTemp) {
            tempVocab = [[message[0], message[1]]];
            useTemp = true;
        }
        else{
            tempVocab.push([message[0], message[1]])
        }
        add_vocab(message[0], message[1]);
    }

    /**
     * Remove a Word
     */
    if (typeof message === 'object' && message.length === 3 && message[2] === 1) {
        remove_vocab(message[0]);
        removedWords.push(message[1]);
    }
});

/**
 * Set the vocabWords to the user's current list
 * @param words current vocab words
 */
function setVocabWords(words){
    vocabWords = words;
}

/**
 * Get user's words from storage and set them as the current vocab words
 */
function prepareVocab(){
    chrome.storage.local.get(['~'], function(words){
        setVocabWords(words['~']);
    });
}

/**
 * Remove any words no longer needed from the list of vocab words
 */
function removeVocabWords(){
    for(let element of removedWords) {
        for (let i = 0; i < vocabWords.length; i++) {
            if (vocabWords[i][1] === element) {
                vocabWords.splice(i, 1);
            }
        }
    }
    removedWords = [];
}
