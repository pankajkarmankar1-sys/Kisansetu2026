import React from "react";

export default function ChatMessage({ message }) {

  return (

    <div
      style={{
        marginBottom: 10,
        textAlign:
          message.sender === "customer"
            ? "right"
            : "left",
      }}
    >

      <div
        style={{
          display: "inline-block",
          background:
            message.sender === "customer"
              ? "#2d8a4e"
              : "#eeeeee",
          color:
            message.sender === "customer"
              ? "#fff"
              : "#000",
          padding: 10,
          borderRadius: 10,
        }}
      >
        {message.text}

        <br />

        <small>{message.time}</small>

      </div>

    </div>

  );

}
