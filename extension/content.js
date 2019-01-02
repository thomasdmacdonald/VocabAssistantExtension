//chrome.storage.local.clear();
replaceFromStorage();
prepareVocab();

let vocabWords = [];
let removedWords = [];
let tempVocab;
let useTemp = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
    //if message is 0, set vocab words
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

    //clear all
    if(message.length === 1 && message[0] === 3){
        removeAll();
        chrome.storage.local.clear();
        vocabWords = [];
        removedWords = [];
        tempVocab = [];
        useTemp = false;
    }

    //if message is an array and 0, add a word
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

    //remove a word
    if (typeof message === 'object' && message.length === 3 && message[2] === 1) {
        remove_vocab(message[0]);
        removedWords.push(message[1]);
    }
});

function setVocabWords(words){
    vocabWords = words;
}

function prepareVocab(){
    chrome.storage.local.get(['~'], function(words){
        setVocabWords(words['~']);
    });
}

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
