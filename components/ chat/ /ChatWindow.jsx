import React, { useState } from "react";
import ChatList from "./ChatList";
import MessageInput from "./MessageInput";

export default function ChatWindow() {

  const [messages, setMessages] = useState([]);

  function sendMessage(text) {

    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: "customer",
        time: new Date().toLocaleTimeString(),
      },
    ]);

  }

  return (

    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        background: "#fff",
        padding: 15,
      }}
    >

      <h2>💬 Chat</h2>

      <ChatList messages={messages} />

      <MessageInput onSend={sendMessage} />

    </div>

  );

}
