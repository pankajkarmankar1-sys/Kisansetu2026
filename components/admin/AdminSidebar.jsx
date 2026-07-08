import React from "react";

export default function AdminSidebar({ onLogout }) {
  return (
    <div
      style={{
        width: 250,
        minHeight: "100vh",
        background: "#1f2937",
        color: "#fff",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: 30 }}>
        🚜 Admin Panel
      </h2>

      <div
        style={{
          marginBottom: 20,
          padding: 10,
          borderRadius: 8,
          background: "#374151",
        }}
      >
        📊 Dashboard
      </div>

      <hr />

      <div
        onClick={onLogout}
        style={{
          marginTop: 20,
          color: "#ff8080",
          cursor: "pointer",
          padding: 10,
        }}
      >
        🚪 Logout
      </div>
    </div>
  );
}
