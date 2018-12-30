chrome.storage.local.clear();
replaceFromStorage();

let vocabWords = [];
let tempVocab;
let useTemp = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
    //if message is 0, set vocab words
    if(message.length === 1 && message[0] === 0){
        chrome.storage.local.get(['~'], function(words){
            setVocabWords(words['~']);
        });

        if(vocabWords !== undefined){
            if(useTemp){
                vocabWords.push(tempVocab);
                useTemp = false;
            }
            sendResponse({list: vocabWords});
        }
        else{
            if(useTemp){
                vocabWords = [tempVocab];
                useTemp = false;
            }
            sendResponse({list: vocabWords});
        }
    }

    //if message is an array and 0, add a word
    if (typeof message === 'object' && message.length === 3 && message[2] === 0) {
        tempVocab = [message[0], message[1]];
        useTemp = true;
        add_vocab(message[0], message[1]);
    }
});

function setVocabWords(words){
    vocabWords = words;
}