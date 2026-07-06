import React from "react";

export default function ChatList({
  chats = [],
  selectedChat,
  onSelect,
}) {
  if (chats.length === 0) {
    return (
      <div
        style={{
          padding: 20,
          textAlign: "center",
          color: "#777",
        }}
      >
        No chats found.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        overflowY: "auto",
        background: "#fff",
        borderRight: "1px solid #ddd",
      }}
    >
      {chats.map((chat) => {
        const active = selectedChat?.id === chat.id;

        return (
          <div
            key={chat.id}
            onClick={() => onSelect(chat)}
            style={{
              padding: 15,
              cursor: "pointer",
              borderBottom: "1px solid #eee",
              background: active ? "#e8f5e9" : "#fff",
              transition: "0.2s",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {chat.name || "Unknown User"}
              </div>

              {chat.unread > 0 && (
                <div
                  style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#2e7d32",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {chat.unread}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 6,
                color: "#666",
                fontSize: 14,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {chat.lastMessage || "No messages"}
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 11,
                color: "#999",
                textAlign: "right",
              }}
            >
              {chat.lastTime || ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
