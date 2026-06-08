import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [title, setTitle] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [prompt, setPrompt] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(""); 

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const result = await chrome.storage.local.get("prompts");
      if (result.prompts) {
        setPrompts(result.prompts);
      }
    } catch (err) {
      console.error("Failed to load prompts:", err);
    }
  };

  const addPrompt = async () => {
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
      const newPrompt = {
        id: Date.now(),
        title,
        shortcut,
        prompt,
      };

      updated = [...prompts, newPrompt];
    }

    try {
      await chrome.storage.local.set({
        prompts: updated,
      });
      setPrompts(updated);
      
      setTitle("");
      setShortcut("");
      setPrompt("");
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const editPrompt = (promptData) => {
    setTitle(promptData.title);
    setShortcut(promptData.shortcut);
    setPrompt(promptData.prompt);
    setEditingId(promptData.id);
  };

  const deletePrompt = async (id) => {
    const updated = prompts.filter((p) => p.id !== id);

    try {
      await chrome.storage.local.set({
        prompts: updated,
      });
      setPrompts(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="cotainer">
      <h1 className="title">PromptVault</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
      className="input"
        type="text"
        placeholder="Prompt Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />


      <input
      className="input"
        type="text"
        placeholder="Shortcut e.g: a,b"
        value={shortcut}
        onChange={(e) => setShortcut(e.target.value)}
      />


      <textarea
      className="textarea"
        rows="5"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />


      <button className="add-btn" onClick={addPrompt}>
        {editingId ? "Update Prompt" : "Add Prompt"}
      </button>

      

      {prompts.map((p) => (
        <div className="prompt-card" key={p.id}>
          <h3 className="card-title">{p.title}</h3>
          <p className="card-shortcut"><strong>Shortcut:</strong> {p.shortcut}</p>
          <p className="card-prompt">{p.prompt}</p>
        
          <button  className="edit-btn" onClick={() => editPrompt(p)}>Edit</button>
          <button className="delete-btn" onClick={() => deletePrompt(p.id)}>Delete</button>
          
        </div>
      ))}
    </div>
  );
}