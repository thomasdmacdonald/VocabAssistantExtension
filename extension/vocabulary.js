function replaceFromStorage(){
    chrome.storage.local.get('~', function(result) {
        let words = result['~'];
        if (words !== undefined){
            replace(words);
        }
    });
}

function replaceFromArray(words){
    if(words !== []) {
        replace(words);
    }
}

function replace(words){
    let nodes = getTextNodes();
    for(let node of nodes){
        let text = node.nodeValue;
        for(let pair of words) {
            let regex = new RegExp('\\b'+pair[0]+'\\b', 'gi');
            text = text.replace(regex, pair[1]);
        }
        node.nodeValue = text;
    }
}

function replaceKorean(pair){
    let nodes = getTextNodes();
    for(let node of nodes){
        let text = node.nodeValue;
        text = text.replace(pair[0], pair[1]);
        node.nodeValue = text;
    }
}

function getTextNodes(){
    let treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let textNodes = [];
    while(node = treeWalker.nextNode()) {
        textNodes.push(node);
    }

    return textNodes;
}

function add_vocab(vocab, translation){
    chrome.storage.local.get(['~'], function(result){
        let words = result['~'];
        let newWords = [];
        if(words !== undefined){
            let newTerm = true;
            if(vocab !== ' ' && vocab !== '~' && translation !== ' '){
                for(let i = 0; i < words.length; i++){
                    if(words[i][0] === vocab){
                        words[i][1] = translation;
                        newTerm = false;
                    }
                }
                if(newTerm){
                    words.push([vocab, translation]);
                }
                newWords = words;
                chrome.storage.local.set({'~': newWords});
            }
            else{
                //display something to say it didn't work
            }
        }
        else{
            newWords = [[vocab, translation]];
            chrome.storage.local.set({'~': newWords});
        }
        replaceFromArray(newWords);
    });
}

function remove_vocab(vocab){
    chrome.storage.local.get(['~'], function(result){
        let words = result['~'];
        let translation;
        if(words !== undefined){
            for(let i =0; i < words.length; i++){
                if(words[i][0] === vocab){
                    translation = words[i][1];
                    words.splice(i, 1);
                }
            }
            chrome.storage.local.set({'~': words});
            replaceKorean([translation, vocab]);
        }
    });
}

function removeAll(){
    chrome.storage.local.get(['~'], function(result){
        let words = result['~'];
        if(words !== undefined){
            for(let i = 0; i < length; i++){
                replaceKorean([words[i][1], words[i][0]]);
            }
        }
    });
}
