/**
 * Listen for button presses
 */
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('add').addEventListener('click', function() {

        let parameters = {
            active: true,
            //take this out to get all active tabs?
            currentWindow: true
        };

        chrome.tabs.query(parameters, send);

        function send(tabs) {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, [eng_input.value, kor_input.value]);
            }
        }
    });
});