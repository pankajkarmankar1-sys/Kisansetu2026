import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatList({ messages = [] }) {

  const bottomRef = useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  return (

    <div
      style={{
        height: 350,
        overflowY: "auto",
        marginBottom: 15,
        padding: 10,
        background: "#f8f8f8",
        borderRadius: 10,
      }}
    >

      {messages.length === 0 ? (

        <p
          style={{
            textAlign: "center",
            color: "#888",
          }}
        >
          No messages yet.
        </p>

      ) : (

        messages.map((msg) => (

          <ChatMessage
            key={msg.id}
            message={msg}
          />

        ))

      )}

      <div ref={bottomRef} />

    </div>

  );

}
