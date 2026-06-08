export default defineContentScript({
  matches: ["https://chatgpt.com/*"],

  main() {
    document.addEventListener("keydown", async (e) => {
      // Ignore shortcuts without Ctrl or Alt
      if (!e.ctrlKey && !e.altKey) return;

      let shortcut = "";

      if (e.ctrlKey) shortcut += "Ctrl+";
      if (e.altKey) shortcut += "Alt+";
      if (e.shiftKey) shortcut += "Shift+";

      // Ignore pressing only modifier keys
      if (
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Shift"
      ) {
        return;
      }

      shortcut += e.key.toUpperCase();

      const result = await chrome.storage.local.get("prompts");
      const prompts = result.prompts || [];

      const match = prompts.find(
        (p) =>
          p.shortcut.toUpperCase() ===
          shortcut.toUpperCase()
      );

      if (!match) return;

      e.preventDefault();
      e.stopPropagation();

      const textarea =
        document.querySelector("#prompt-textarea") ||
        document.querySelector('[contenteditable="true"]');

      if (!textarea) return;

      textarea.focus();

      textarea.textContent = match.prompt;

      textarea.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          cancelable: true,
        })
      );

      setTimeout(() => {
        const sendButton =
          document.querySelector(
            'button[data-testid="send-button"]'
          ) ||
          document.querySelector(
            'button[aria-label*="Send"]'
          );

        if (sendButton) {
          sendButton.click();
        }
      }, 500);
    });
  },
});