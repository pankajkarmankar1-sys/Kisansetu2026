import React from "react";

export default function AdminSidebar({ onLogout }) {
  const isMobile =
    typeof window !== "undefined" &&
    window.innerWidth < 768;

  return (
    <div
      style={{
        width: isMobile ? "100%" : 250,
        minHeight: isMobile ? "auto" : "100vh",
        background: "#1f2937",
        color: "#fff",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        🚜 Admin Panel
      </h2>

      <div
        style={{
          marginBottom: 15,
          padding: 12,
          borderRadius: 8,
          background: "#374151",
          textAlign: "center",
        }}
      >
        📊 Dashboard
      </div>

      <button
        onClick={onLogout}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 20,
          border: "none",
          borderRadius: 8,
          background: "#dc2626",
          color: "#fff",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}
