// this background script is used to invoke desktopCapture API
// to capture screen-MediaStream.

var screenOptions = ['screen', 'window',"audio"];

chrome.runtime.onConnect.addListener(function (port) {
  
    port.onMessage.addListener(portOnMessageHanlder);

    // this one is called for each message from "content-script.js"
    //以下这个方法用于处理消息从content.js传过来的
    function portOnMessageHanlder(message) {
       
        if(message == 'get-sourceIdqhz') {
           console.log('B01');
            chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, onAccessApproved);
           console.log('B02');
            
        }

        if(message == 'audio-plus-tabqhz') {
            screenOptions = ['audio', 'tab'];
            chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, onAccessApproved);
        }
    }

    // on getting sourceId
    // "sourceId" will be empty if permission is denied.

    function onAccessApproved(sourceId,options) {
        // if "cancel" button is clicked
        if(!sourceId || !sourceId.length) {
            return port.postMessage('PermissionDeniedError');
        }

        // "ok" button is clicked; share "sourceId" with the
        // content-script which will forward it to the webpage
        console.log('B03-sourceId',sourceId);
        if(options.canRequestAudioTrack===true){
            port.postMessage({
                sourceId: sourceId

            });
        }
        console.log('B04');
    }
});
