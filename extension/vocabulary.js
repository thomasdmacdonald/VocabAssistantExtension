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
    let elements = document.getElementsByTagName('*');
    for(let i = 0; i < elements.length; i++){
        let element = elements[i];
        for(let j = 0; j < element.childNodes.length; j++){
            let node = element.childNodes[j];
            if(node.nodeType === 3){
                let text = node.textContent;
                console.log(text);
                for(let pair of words) {
                    let regex = new RegExp(pair[0], 'gi');
                    text = text.replace(regex, pair[1]);
                }
                element.replaceChild(document.createTextNode(text), node);
            }
        }
    }
}

function add_vocab(vocab, translation){
    chrome.storage.local.get(['~'], function(result){
        let words = result['~'];
        let newWords = [];
        if(words !== undefined){
            //replace with a search for a regex for whitespace?
            if(vocab !== ' ' && vocab !== '~' && translation !== ' '){
                words.push([vocab, translation]);
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

