import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [title, setTitle] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [prompt, setPrompt] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    const result =
      await chrome.storage.local.get("prompts");

    setPrompts(result.prompts || []);
  };

  const handleShortcutCapture = (e) => {
    e.preventDefault();

    if (!e.ctrlKey && !e.altKey) return;

    let key = "";

    if (e.ctrlKey) key += "Ctrl+";
    if (e.altKey) key += "Alt+";
    if (e.shiftKey) key += "Shift+";

    if (
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Shift"
    ) {
      return;
    }

    key += e.key.toUpperCase();

    setShortcut(key);
  };

  const addPrompt = async () => {
    if (!title.trim()) return;
    if (!prompt.trim()) return;

    if (
      !shortcut.startsWith("Ctrl+") &&
      !shortcut.startsWith("Alt+")
    ) {
      return;
    }

    let updated;

    if (editingId) {
      updated = prompts.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title,
              shortcut,
              prompt,
            }
          : p
      );
    } else {
      updated = [
        ...prompts,
        {
          id: Date.now(),
          title,
          shortcut,
          prompt,
        },
      ];
    }

    await chrome.storage.local.set({
      prompts: updated,
    });

    setPrompts(updated);

    setTitle("");
    setShortcut("");
    setPrompt("");
    setEditingId(null);
  };

  const editPrompt = (p) => {
    setTitle(p.title);
    setShortcut(p.shortcut);
    setPrompt(p.prompt);
    setEditingId(p.id);
  };

  const deletePrompt = async (id) => {
    const updated = prompts.filter(
      (p) => p.id !== id
    );

    await chrome.storage.local.set({
      prompts: updated,
    });

    setPrompts(updated);
  };

  return (
    <div className="container">
      <h1 className="title">
        PromptVault
      </h1>

      <input
        className="input"
        type="text"
        placeholder="Prompt Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        className="input"
        type="text"
        placeholder="Press Ctrl or Alt shortcut"
        value={shortcut}
        readOnly
        onKeyDown={handleShortcutCapture}
      />

      <textarea
        className="textarea"
        rows="5"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) =>
          setPrompt(e.target.value)
        }
      />

      <button
        className="add-btn"
        onClick={addPrompt}
      >
        {editingId
          ? "Update Prompt"
          : "Add Prompt"}
      </button>

      <div className="saved-title">
        Saved Prompts
      </div>

      {prompts.map((p) => (
        <div
          className="prompt-card"
          key={p.id}
        >
          <h3 className="prompt-title">{p.title}</h3>

          <div className="badge">
            {p.shortcut}
          </div>

          <p className="prompt">{p.prompt}</p>

          <div className="actions">
            <button
              className="edit-btn"
              onClick={() =>
                editPrompt(p)
              }
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() =>
                deletePrompt(p.id)
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}