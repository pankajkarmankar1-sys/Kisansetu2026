import NotificationBell from "./NotificationBell";

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
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#16a34a",
          color: "#fff",
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>🚜 KisanSetu</h2>
          <p style={{ margin: "10px 0 0" }}>
            Welcome, <b>{user?.name || "Farmer"}</b>
          </p>

          <p style={{ margin: "6px 0 0", fontSize: 14 }}>
            📱 {user?.phone || "No Phone"}
          </p>
        </div>

        <NotificationBell onClick={onNotifications} />
      </div>

      <button style={btn} onClick={onBook}>
        🚜 Book Tractor
      </button>

      <button style={btn} onClick={onBookings}>
        📋 My Bookings
      </button>

      <button style={btn} onClick={onProfile}>
        👤 My Profile
      </button>

      <button
        style={{
          ...btn,
          background: "#ef4444",
        }}
        onClick={onLogout}
      >
        🚪 Logout
      </button>
    </div>
  );
}

const btn = {
  width: "100%",
  padding: 16,
  marginBottom: 16,
  border: "none",
  borderRadius: 14,
  background: "#16a34a",
  color: "#fff",
  fontSize: 17,
  fontWeight: "bold",
  cursor: "pointer",
};
