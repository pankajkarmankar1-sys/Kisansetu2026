import React from "react";

export default function Home({ user }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>🌾 KisanSetu</h1>

      <h2>Welcome</h2>

      <p>
        {user?.name || "Farmer"}
      </p>

      <div style={{ marginTop: 20 }}>
        <button>🚜 Book Tractor</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button>📦 My Bookings</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button>👤 Profile</button>
      </div>
    </div>
  );
}
