/**
 * Popup script
 * Handles visuals of the popup and messaging the scripts
 */
constructTextBoxes();

/**
 * Listen for button presses
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * Koreanize romanized input
     */
    document.getElementById('roman').addEventListener('click', function() {
        translate(document.getElementById('kor_input').value);
    });

    /**
     * Add a new or duplicate word
     */
    document.getElementById('add').addEventListener('click', function() {
        let eng = eng_input.value;
        let kor = kor_input.value;

        if(eng !== ' ' && eng !== '' && eng !== '~' && kor !== ' ' && kor !== '' && kor !== '~') {
            let divide = document.getElementById("vocab");
            let nodes = divide.childNodes;
            let newTerm = true;
            for(let i = 0; i < nodes.length; i++){
                if(nodes[i].childNodes[0].value === eng){
                    nodes[i].childNodes[1].value = kor;
                    newTerm = false;
                }
            }

            if(newTerm) {
                addTextBox(eng, kor);
                chrome.runtime.sendMessage([10, eng, kor]);
            }
            else{
                chrome.runtime.sendMessage([11, eng, kor]);
            }

            document.getElementById('eng_input').value = "";
            document.getElementById('kor_input').value = "";
        }

    });

    /**
     * Clear all entries in memory
     */
    document.getElementById('clearAll').addEventListener('click', function(){
        let boxes = document.getElementById('vocab');
        while (boxes.hasChildNodes()) {
            boxes.removeChild(boxes.lastChild);
        }
        chrome.runtime.sendMessage([13]);
    });
});

/**
 * Removes a vocab word from the user's list
 * @param vocab English vocab word
 * @param trans Korean translation
 */
function removeVocab(vocab){
    chrome.runtime.sendMessage([12, vocab]);
}

/**
 * Add the necessary HTML elements for a vocab/translation pair
 * @param vocab english vocab word
 * @param trans Korena translation
 */
function addTextBox(vocab, trans){
    let english = document.createElement("input");
    english.value = vocab;
    english.className = "englishText";
    english.readOnly = true;
    english.size = "22";

    let korean = document.createElement("input");
    korean.readOnly = true;
    korean.value = trans;
    korean.className = "koreanText";
    korean.size = "12";

    let remove = document.createElement("button");
    remove.innerHTML = "X";
    remove.className = "buttonRemove";
    remove.type = "button";

    let divide = document.createElement("div");
    divide.appendChild(english);
    divide.appendChild(korean);
    divide.appendChild(remove);

    remove.addEventListener('click', function() {
        removeVocab(vocab);
        divide.parentNode.removeChild(divide);
    });

    let element = document.getElementById("vocab");
    element.appendChild(divide);
}

/**
 * Builds all needed HTMl elements for all words in vocab list
 */
function constructTextBoxes(){
    chrome.runtime.sendMessage([14], function(response){
        if (response.list !== undefined) {
            for (let pair of response.list) {
                addTextBox(pair[0], pair[1]);
            }
        }
    });
}

/**
 * Translates a romanized string and copies it to clipboard
 * @param string : input string from user
 */
function translate(string) {
    document.getElementById('kor_input').value = deromanize(string);
}
