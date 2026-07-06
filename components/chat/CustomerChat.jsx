import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

export default function CustomerChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender_id: "driver",
      sender_name: "Driver",
      message: "Namaste! Main aapka driver hoon.",
      created_at: new Date().toISOString(),
    },
  ]);

  const currentUserId = "customer";

  function handleSend(text) {
    const newMessage = {
      id: Date.now(),
      sender_id: currentUserId,
      sender_name: "You",
      message: text,
      created_at: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          padding: 15,
          background: "#2e7d32",
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Customer Chat
      </div>

      <ChatWindow
        messages={messages}
        currentUserId={currentUserId}
      />

      <ChatInput
        onSend={handleSend}
        placeholder="Type your message..."
      />
    </div>
  );
}
