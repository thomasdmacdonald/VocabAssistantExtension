/**
 * Popup script
 * Deals with turning romanized english to korean
 */

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
    let regex = '^';
    regex += '(';
    for(let key in firstLetter){
        if(key !== '') {
            regex += '(?:' + key + ')|';
        }
    }
    regex = regex.substring(0, regex.length - 1);
    regex += ')?';

    regex += '(';
    for(let key in secondLetter){
        regex += '(?:'+key+')|';
    }
    regex = regex.substring(0, regex.length - 1);
    regex += ')';

    regex += '(';
    for(let key in thirdLetter){
        if(key !== '') {
            regex += '(?:' + key + ')|';
        }
    }
    regex = regex.substring(0, regex.length - 1);
    regex += ')?$';

    let testReg = new RegExp(regex, 'i');
    return testReg.test(string);
}

/**
 * Turns an array of letters into integer codes
 * @param letters :     array of letters
 * @returns {*[]} :     array of integers
 */
function decodeLetters(letters){
    return [firstLetter[letters[0].toLowerCase()], secondLetter[letters[1].toLowerCase()], thirdLetter[letters[2].toLowerCase()]];
}

/**
 * Given integer codes for letters, returns a korean text character
 * @param syllable :    array of integers
 * @returns {string} :  korean character
 */
function combine(syllable){
    return String.fromCharCode(44032 + (syllable[0]*588) + (syllable[1]*28) + syllable[2])
}