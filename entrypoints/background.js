
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
    if (message.action === 'authenticate') {
      (async () => {
        try {
          console.log(message)
          const resp = await fetch('http://localhost:4000/extension', {
            headers: {
              'x-extension-id': browser.runtime.id
            }
          })
          if (resp.ok)
            sendResponse({ ok: true })
          else sendResponse({ ok: false })
        } catch (err) {
          console.log(err)
          sendResponse({ ok: false })
        }
      })()
      return true
    }
  });
});