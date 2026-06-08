
export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'RELAY_TO_CONTENT') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, message.payload, (response) => {
            sendResponse(response);
          });
        }
      });
      return true; 
    }

    if (message.type === 'TRACK_USAGE') {
      chrome.storage.local.get(['prompts'], (result) => {
        const prompts = result.prompts || [];
        const updated = prompts.map((p) => {
          if (p.id === message.promptId) {
            return {
              ...p,
              usageCount: (p.usageCount || 0) + 1,
              lastUsed: Date.now(),
            };
          }
          return p;
        });
        chrome.storage.local.set({ prompts: updated });
      });
      sendResponse({ ok: true });
      return true;
    }
  });
});