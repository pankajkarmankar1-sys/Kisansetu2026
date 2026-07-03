import { useState } from "react";
import NotificationBell from "../notifications/NotificationBell";
import { useNavigate } from "react-router-dom";
export default function Dashboard({
  user,
  onBook,
  onBookings,
  onProfile,
  onNotifications,
  onLogout,
}) {
  return (
    <div style={{ padding: 20 }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <div>
          <h2>👨‍🌾 Welcome</h2>
          <h3>{user?.name || "Farmer"}</h3>
        </div>

        <NotificationBell onClick={onNotifications} />
      </div>

      <button
        onClick={onBook}
        style={btn}
      >
        🚜 Book Tractor
      </button>

      <button
        onClick={onBookings}
        style={btn}
      >
        📋 My Bookings
      </button>

      <button
        onClick={onProfile}
        style={btn}
      >
        👤 Profile
      </button>

      <button
        onClick={onLogout}
        style={{
          ...btn,
          background: "#d32f2f",
        }}
      >
        Logout
      </button>

    </div>
  );
}


const btn = {
  width: "100%",
  padding: 16,
  marginBottom: 15,
  border: "none",
  borderRadius: 12,
  fontSize: 18,
  background: "#16a34a",
  color: "#fff",
  cursor: "pointer",
};
const navigate = useNavigate();
<Route
  path="/dashboard"
  element={
    <Dashboard
      user={{ name: "Pankaj" }}
      onBook={() => navigate("/book")}
      onBookings={() => navigate("/bookings")}
      onProfile={() => navigate("/profile")}
      onNotifications={() => alert("Notifications")}
      onLogout={() => navigate("/login")}
    />
  }
/>
