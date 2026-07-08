import React from "react";

export default function Dashboard({
  user,
  onBook,
  onBookings,
  onProfile,
  onNotifications,
  onLogout,
}) {
  return (
    <div
      style={{
        padding: 20,
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <h1>🚜 KisanSetu Dashboard</h1>

      <h2>
        Welcome {user?.name || "User"}
      </h2>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 25,
        }}
      >
        <button onClick={onBook} style={{ padding: 15 }}>
          📅 Book Service
        </button>

        <button onClick={onBookings} style={{ padding: 15 }}>
          📋 My Bookings
        </button>

        <button onClick={onProfile} style={{ padding: 15 }}>
          👤 Profile
        </button>

        <button onClick={onNotifications} style={{ padding: 15 }}>
          🔔 Notifications
        </button>

        <button
          onClick={onLogout}
          style={{
            padding: 15,
            background: "#dc2626",
            color: "#fff",
            border: "none",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
