import React from "react";

export default function ChatMessage({ message }) {
  const isCustomer = message?.sender_type === "customer";

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
        {message?.message}

        {message?.image_url && (
          <div style={{ marginTop: 8 }}>
            <img
              src={message.image_url}
              alt="Chat"
              style={{
                maxWidth: 220,
                borderRadius: 8,
              }}
            />
          </div>
        )}

        <br />

        <small style={{ opacity: 0.7 }}>
          {message?.created_at
            ? new Date(message.created_at).toLocaleString("en-IN")
            : ""}
        </small>
      </div>
    </div>
  );
}
