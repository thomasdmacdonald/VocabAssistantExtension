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
    let paragraph = document.createElement("p");
    paragraph.appendChild(document.createTextNode(vocab+': '+trans));
    let element = document.getElementById("vocab");
    element.appendChild(paragraph);
}

function constructTextBoxes(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, [0], function(response){
            if(response.list !== undefined) {
                for (let pair of response.list) {
                    addTextBox(pair[0], pair[1]);
                }
            }
        });
    });
}
