import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({
  messages = [],
  currentUserId,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!messages.length) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#777",
          fontSize: 15,
          padding: 20,
        }}
      >
        No messages yet.
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: 15,
        background: "#f4f6f9",
      }}
    >
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          own={msg.sender_id === currentUserId}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
