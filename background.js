chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "tabsData") {
    chrome.runtime.sendMessage({ action: "receiveData", data: message.data });
  }
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "sendData") {
    chrome.runtime.sendMessage({ action: "receiveData", data: message.data });
  }
});
