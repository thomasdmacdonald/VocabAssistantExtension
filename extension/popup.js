constructTextBoxes();

/**
 * Listen for button presses
 */
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('add').addEventListener('click', function() {

        addTextBox(eng_input.value, kor_input.value);

        let parameters = {
            active: true,
            //take this out to get all active tabs?
            currentWindow: true
        };

        chrome.tabs.query(parameters, send);

        function send(tabs) {
            for (let tab of tabs) {
                //0 parameter denotes an add action
                chrome.tabs.sendMessage(tab.id, [eng_input.value, kor_input.value, 0]);
            }
        }
    });
});

function addTextBox(vocab, trans){
    let english = document.createElement("input");
    english.value = vocab;
    english.className = "englishText";
    english.readOnly = true;
    english.size = "22";

    let korean = document.createElement("input");
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

    let element = document.getElementById("vocab");
    element.appendChild(divide);
}

function constructTextBoxes(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, [0], function(response){
            if(response !== undefined) {
                if (response.list !== undefined) {
                    for (let pair of response.list) {
                        addTextBox(pair[0], pair[1]);
                    }
                }
            }
            else{
                //display something to tell user to open popup in a page
            }
        });
    });
}
