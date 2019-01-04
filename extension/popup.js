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
 * Removes a vocab word from the user's list
 * @param vocab English vocab word
 * @param trans Korean translation
 */
function removeVocab(vocab){
    chrome.runtime.sendMessage([12, vocab]);
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * Translates a romanized string and copies it to clipboard
 * @param string : input string from user
 */
function translate(string) {
    document.getElementById('kor_input').value = deromanize(string);
}

/**
 * Turns a line of romanized text into korean, if valid.
 * Non-valid text will be left as is
 * @param line :    text input by user
 * @returns {string} :  korean text
 */
function deromanize(line){
    let hangulLine = '';
    let syllable = '';
    let place = 0;
    while(place !== line.length){
        if((line[place] === '-') || (line[place] === ' ')){
            if(valid(syllable)){
                let letters = decodeLetters(parseSyllable(syllable));
                hangulLine += combine(letters);
                syllable = '';
            }
            else{
                if(syllable !== ' '){
                    hangulLine += syllable;
                }
                syllable = '';
            }
            if(line[place] === ' '){
                hangulLine += ' ';
            }
        }
        else{
            syllable += line[place];
        }
        place++;
    }
    if(valid(syllable)){
        let letters = decodeLetters(parseSyllable(syllable));
        hangulLine += combine(letters);
    }
    else{
        hangulLine += syllable;
    }
    return hangulLine;
}

/**
 * Converts a valid syllable into a list of its letters
 * @param syl :     valid korean syllable
 * @returns {*[]}   Array of letters
 */
function parseSyllable(syl){
    let vowels = ["a", "e", "i", "o", "u", "w", "y"];
    let firstList = [];
    let middleList =[];
    let endList = [];
    let first = '';
    let middle = '';
    let end = '';

    if(syl.length >= 1 && syl.length <= 7) {
        let place = 0;
        if (vowels.includes(syl[0])) {
            first = '';
        }
        else if (vowels.includes(syl[1])) {
            place += 1;
            firstList = syl[0];
        }
        else {
            place += 2;
            firstList = syl.slice(0, 2);
        }
        if(syl.length === place + 1) {
            middleList = syl[place];
            place += 1;
        }
        else if(!(vowels.includes(syl[place+1]))){
            middleList = syl[place];
            place += 1;
        }
        else if(syl.length === place + 2){
            middleList = syl.slice(place, place + 2);
            place += 2;
        }
        else if(!(vowels.includes(syl[place+2]))){
            middleList = syl.slice(place, place + 2);
            place += 2;
        }
        else {
            middleList = syl.slice(place, place + 3);
            place += 3
        }
        endList = syl.slice(place);

        for(let i = 0; i < firstList.length; i++){
            first = first + firstList[i];
        }
        for(let i = 0; i < middleList.length; i++){
            middle = middle + middleList[i];
        }
        for(let i = 0; i < endList.length; i++){
            end = end + endList[i];
        }
    }

    return [first, middle, end]
}

/**
 * Returns whether or not a syllable is a valid romanization
 * @param string :  input syllable
 * @returns {boolean}   whether the syllable is valid
 */
function valid(string){
    return /^((?:g)|(?:gg)|(?:n)|(?:d)|(?:dd)|(?:l)|(?:r)|(?:m)|(?:b)|(?:bb)|(?:pp)|(?:s)|(?:ss)|(?:j)|(?:jj)|(?:ch)|(?:k)|(?:t)|(?:p)|(?:h))?((?:a)|(?:ae)|(?:ya)|(?:yae)|(?:eo)|(?:ou)|(?:e)|(?:yeo)|(?:you)|(?:ye)|(?:o)|(?:wa)|(?:wae)|(?:oi)|(?:yo)|(?:u)|(?:oo)|(?:weo)|(?:we)|(?:wi)|(?:wee)|(?:yu)|(?:yoo)|(?:eu)|(?:eui)|(?:i)|(?:ee))((?:g)|(?:gg)|(?:gs)|(?:n)|(?:nj)|(?:nh)|(?:d)|(?:l)|(?:lg)|(?:lm)|(?:lb)|(?:ls)|(?:lt)|(?:lp)|(?:lh)|(?:r)|(?:rg)|(?:rm)|(?:rb)|(?:rs)|(?:rt)|(?:rp)|(?:rh)|(?:m)|(?:b)|(?:bs)|(?:s)|(?:ss)|(?:ng)|(?:j)|(?:ch)|(?:k)|(?:t)|(?:p)|(?:h))?$/.test(string);
}

/**
 * Turns an array of letters into integer codes
 * @param letters :     array of letters
 * @returns {*[]} :     array of integers
 */
function decodeLetters(letters){
    let firstLetter = {
        'g': 0,
        'gg': 1,
        'n': 2,
        'd': 3,
        'dd': 4,
        'l': 5,
        'r': 5,
        'm': 6,
        'b': 7,
        'bb': 8,
        'pp': 8,
        's': 9,
        'ss': 10,
        '': 11,
        'j': 12,
        'jj': 13,
        'ch': 14,
        'k': 15,
        't': 16,
        'p': 17,
        'h': 18
    };
    let secondLetter = {
        'a': 0,
        'ae': 1,
        'ya': 2,
        'yae': 3,
        'eo': 4,
        'ou': 4,
        'e': 5,
        'yeo': 6,
        'you': 6,
        'ye': 7,
        'o': 8,
        'wa': 9,
        'wae': 10,
        'oi': 11,
        'yo': 12,
        'u': 13,
        'oo': 13,
        'weo': 14,
        'we': 15,
        'wi': 16,
        'wee': 16,
        'yu': 17,
        'yoo': 17,
        'eu': 18,
        'eui': 19,
        'ee': 20,
        'i': 20
    };
    let thirdLetter = {
        '': 0,
        'g': 1,
        'gg': 2,
        'gs': 3,
        'n': 4,
        'nj': 5,
        'nh': 6,
        'd': 7,
        'l': 8,
        'lg': 9,
        'lm': 10,
        'lb': 11,
        'ls': 12,
        'lt': 13,
        'lp': 14,
        'lh': 15,
        'r': 8,
        'rg': 9,
        'rm': 10,
        'rb': 11,
        'rs': 12,
        'rt': 13,
        'rp': 14,
        'rh': 15,
        'm': 16,
        'b': 17,
        'bs': 18,
        's': 19,
        'ss': 20,
        'ng': 21,
        'j': 22,
        'ch': 23,
        'k': 24,
        't': 25,
        'p': 26,
        'h': 27
    };
    return [firstLetter[letters[0]], secondLetter[letters[1]], thirdLetter[letters[2]]];
}

/**
 * Given integer codes for letters, returns a korean text character
 * @param syllable :    array of integers
 * @returns {string} :  korean character
 */
function combine(syllable){
    return String.fromCharCode(44032 + (syllable[0]*588) + (syllable[1]*28) + syllable[2])
}
