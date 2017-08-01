// this content-script plays role of medium to publish/subscribe messages from webpage to the background script
//本脚本起到了一个桥梁作用
// this object is used to make sure our extension isn't conflicted with irrelevant messages!

var rtcmulticonnectionMessages = {
    'are-you-there': true,
    'get-sourceId':  true,
    'audio-plus-tab': true
};

// this port connects with background script
//port用于和background.js建立联系
var port = chrome.runtime.connect();

// if background script sent a message
//下面这个方法用于从背景页（background.js）接收消息，并传到网页端（get.html）
port.onMessage.addListener(function (message) {
    console.log('C01-message->',message);
    // get message from background script and forward to the webpage
    window.postMessage(message, '*');
});

// this event handler watches for messages sent from the webpage
// it receives those messages and forwards to background script
//下面这个方法用于接收从网页端(get.html)来的消息，并传给background-script.js文件
window.addEventListener('message', function (event) {

   console.log('C02-event:',event);
    // if invalid source
    if (event.source != window)
        return;
       
    // it is 3rd party message
    if(!rtcmulticonnectionMessages[event.data]) return;

    // if browser is asking whether extension is available
    if(event.data == 'are-you-there') {
   
        window.postMessage('rtcmulticonnection-extension-loaded', '*');
    
    }

    // if it is something that need to be shared with background script
    if(event.data == 'get-sourceId' || event.data === 'audio-plus-tab') {
        console.log('C03');
        // forward message to background script
        port.postMessage(event.data+'qhz');

        console.log('C04');
    }
  
});

// inform browser that you're available!
window.postMessage('rtcmulticonnection-extension-loaded', '*');
