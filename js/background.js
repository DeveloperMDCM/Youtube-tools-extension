function estado() {
    console.log('activo') };
chrome.action.onClicked.addListener((tab) => {
      if(tab.url.includes("youtube"))  {
          chrome.tabs.create({ url: '/index.html', active: true });
          chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["/js/content.js"]
            })
}});

chrome.action.onClicked.addListener(() => {
    estado();
});

