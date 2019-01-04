/**
 * The backgroudn script for the extension
 * Mainly deals with changing chrome memory
 */

let list = [];
get();

chrome.runtime.onMessage.addListener(function(message, sender, reply) {
    if(message[0] === 10){
        add_vocab(message[1], message[2]);
    }
    if(message[0] === 11){
        update_vocab(message[1], message[2]);
    }
    if(message[0] === 12){
        remove_vocab(message[1]);
    }
    if(message[0] === 13){
        clear_vocab();
    }
    if(message[0] === 14){
        reply({list: list});
    }
});

/**
 * Add a word/translation pair to storage and then replace all instances of that word on the page
 * @param vocab Vocab word
 * @param translation   Korean translation
 */
function add_vocab(vocab, translation){
    list.push([vocab, translation]);

    chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, [0, vocab, translation]);
        }
    });

    set();
}

/**
 * Update a word/translation pair to storage and then replace all instances of that word on the page
 * @param vocab Vocab word
 * @param translation   Korean translation
 */
function update_vocab(vocab, translation){
    let oldTrans;
    for(let i = 0; i < list.length; i++){
        if(list[i][0] === vocab){
            oldTrans = list[i][1];
            list[i][1] = translation;
        }
    }

    chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, [1, oldTrans, translation]);
        }
    });

    set();
}

/**
 * Remove a word from the user's list
 * @param vocab Word to be removed
 */
function remove_vocab(vocab){
    let translation;
    if(list !== []){
        for(let i =0; i < list.length; i++){
            if(list[i][0] === vocab){
                translation = list[i][1];
                list.splice(i, 1);
            }
        }
        chrome.tabs.query({}, function(tabs) {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, [2, translation, vocab]);
            }
        });
    }
    set();
}

/**
 * Remove all words from the user's list
 */
function clear_vocab(){
    if(list !== []){
        let reverse = [];
        for(let i = 0; i < list.length; i++){
            reverse.push([list[i][1], list[i][0]]);
        }

        list = [];

        chrome.tabs.query({}, function(tabs) {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, [3, reverse]);
            }
        });
    }
    set();
}

/**
 * Set the chrome local storage for [~]
 */
function set(){
    chrome.storage.local.set({'~': list});
}

/**
 * Sets list equal to whatever is in local storage
 */
function get(){
    chrome.storage.local.get(['~'], function(result){
        let words = result['~'];
        if(words !== undefined){
            list = words;
        }
        else{
            list = [];
        }
    });
}