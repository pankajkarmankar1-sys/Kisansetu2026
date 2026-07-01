import React from "react";

export default function StatsCard({ bookings = [] }) {

  const total = bookings.length;

  const pending = bookings.filter(
    (b) => (b.booking_status || b.status) === "Pending"
  ).length;

  const running = bookings.filter(
    (b) => (b.booking_status || b.status) === "Running"
  ).length;

  const completed = bookings.filter(
    (b) => (b.booking_status || b.status) === "Completed"
  ).length;

  const revenue = bookings
    .filter((b) => (b.booking_status || b.status) === "Completed")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
        gap: 15,
        marginBottom: 20,
      }}
    >
      <Card title="📋 Total" value={total} />
      <Card title="⏳ Pending" value={pending} />
      <Card title="🚜 Running" value={running} />
      <Card title="✅ Completed" value={completed} />
      <Card title="💰 Revenue" value={`₹${revenue}`} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 15,
        textAlign: "center",
      }}
    >
      <h4>{title}</h4>

      <h2>{value}</h2>
    </div>
  );
}
