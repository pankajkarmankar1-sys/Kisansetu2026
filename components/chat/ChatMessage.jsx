import React from "react";

export default function ChatMessage({ message, own = false }) {
  const time = message?.created_at
    ? new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: own ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: 14,
          background: own ? "#2e7d32" : "#ffffff",
          color: own ? "#ffffff" : "#222222",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          wordBreak: "break-word",
        }}
      >
        {message?.sender_name && (
          <div
            style={{
              fontSize: 12,
              fontWeight: "bold",
              marginBottom: 4,
              opacity: 0.8,
            }}
          >
            {own ? "You" : message.sender_name}
          </div>
        )}

        <div
          style={{
            fontSize: 15,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {message?.message}
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            textAlign: "right",
            opacity: 0.7,
          }}
        >
          {time}
          {own &&
            (message?.status === "read"
              ? " ✓✓"
              : message?.status === "delivered"
              ? " ✓✓"
              : " ✓")}
        </div>
      </div>
    </div>
  );
}
