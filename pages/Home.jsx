import React from "react";

export default function Home({ user }) {
  const services = [
    "🚜 Tractor",
    "🌱 Rotavator",
    "🌾 Cultivator",
    "💧 Sprayer",
    "🌿 Seeder",
    "🚛 Transport",
  ];

  return (
    <div
      style={{
        background: "#F5F7FA",
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#2E7D32,#43A047)",
          color: "white",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>🌾 KisanSetu</h2>
        <p style={{ marginTop: 10 }}>नमस्ते, {user?.name || "Farmer"} 👋</p>
      </div>

      {/* Farm Card */}
      <div
        style={{
          background: "#fff",
          marginTop: 20,
          padding: 20,
          borderRadius: 18,
          boxShadow: "0 3px 10px rgba(0,0,0,.1)",
        }}
      >
        <h3>🌾 My Farms</h3>
        <p>Manage your farms easily.</p>

        <button
          style={{
            background: "#2E7D32",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 12,
          }}
        >
          + Add Farm
        </button>
      </div>

      {/* Premium */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 18,
          background: "linear-gradient(135deg,#FFD54F,#F9A825)",
        }}
      >
        <h3>💎 KisanSetu Premium</h3>
        <p>Priority Booking • Discount • Premium Support</p>

        <button
          style={{
            background: "#2E7D32",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 12,
          }}
        >
          Activate
        </button>
      </div>

      {/* Services */}
      <h3 style={{ marginTop: 25 }}>🚜 Farm Services</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 15,
        }}
      >
        {services.map((item) => (
          <div
            key={item}
            style={{
              background: "#fff",
              padding: 18,
              borderRadius: 18,
              textAlign: "center",
              boxShadow: "0 3px 10px rgba(0,0,0,.08)",
              fontWeight: "bold",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Upcoming Booking */}
      <div
        style={{
          background: "#fff",
          marginTop: 20,
          padding: 20,
          borderRadius: 18,
          boxShadow: "0 3px 10px rgba(0,0,0,.08)",
        }}
      >
        <h3>📅 Upcoming Booking</h3>
        <p>No booking available.</p>
      </div>
    </div>
  );
}
