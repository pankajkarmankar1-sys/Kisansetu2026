import React from "react";
import ChatMessage from "./ChatMessage";

export default function ChatList({ messages }) {

  return (

    <div
      style={{
        height: 300,
        overflowY: "auto",
        marginBottom: 15,
      }}
    >

      {messages.map((msg) => (

        <ChatMessage
          key={msg.id}
          message={msg}
        />

      ))}

    </div>

  );

}
