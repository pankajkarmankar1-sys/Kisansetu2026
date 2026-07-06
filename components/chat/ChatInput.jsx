import React, { useState } from "react";

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}) {
  const [text, setText] = useState("");

  function handleSend() {
    const message = text.trim();

    if (!message) return;

    if (onSend) {
      onSend(message);
    }

    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: 12,
        background: "#fff",
        borderTop: "1px solid #ddd",
      }}
    >
      <textarea
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        style={{
          flex: 1,
          resize: "none",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
          outline: "none",
          fontSize: 15,
        }}
      />

      <button
        onClick={handleSend}
        disabled={disabled || text.trim() === ""}
        style={{
          minWidth: 90,
          border: "none",
          borderRadius: 8,
          background: "#2e7d32",
          color: "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: 15,
        }}
      >
        Send
      </button>
    </div>
  );
}
