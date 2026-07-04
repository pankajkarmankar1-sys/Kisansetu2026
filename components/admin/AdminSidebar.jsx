import React from "react";

export default function AdminSidebar() {
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
      <h2 style={{ marginBottom: 30 }}>🚜 Admin Panel</h2>

      <div style={{ marginBottom: 20, cursor: "pointer" }}>
        📊 Dashboard
      </div>

      <div style={{ marginBottom: 20, cursor: "pointer" }}>
        📋 Bookings
      </div>

      <div style={{ marginBottom: 20, cursor: "pointer" }}>
        🚜 Drivers
      </div>

      <div style={{ marginBottom: 20, cursor: "pointer" }}>
        👨‍🌾 Customers
      </div>

      <div style={{ marginBottom: 20, cursor: "pointer" }}>
        ⚙️ Settings
      </div>

      <hr />

      <div
        style={{
          marginTop: 20,
          color: "#ff8080",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </div>
    </div>
  );
}
