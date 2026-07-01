import React, { useState } from "react";

export default function MessageInput({ onSend }) {

  const [text, setText] = useState("");

  return (

    <div
      style={{
        display: "flex",
        gap: 10,
      }}
    >

      <input
        style={{
          flex: 1,
          padding: 10,
        }}
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Type message..."
      />

      <button
        onClick={() => {

          onSend(text);

          setText("");

        }}
      >
        Send
      </button>

    </div>

  );

}
