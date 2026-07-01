import React from "react";

export default function ChatMessage({ message }) {

  const isCustomer = message?.sender === "customer";

  return (

    <div
      style={{
        marginBottom: 10,
        textAlign: isCustomer ? "right" : "left",
      }}
    >

      <div
        style={{
          display: "inline-block",
          background: isCustomer ? "#2d8a4e" : "#eeeeee",
          color: isCustomer ? "#fff" : "#000",
          padding: 10,
          borderRadius: 10,
          maxWidth: "70%",
          wordBreak: "break-word",
        }}
      >

        {message?.text}

        <br />

        <small>
          {message?.time || message?.created_at || ""}
        </small>

      </div>

    </div>

  );

}
