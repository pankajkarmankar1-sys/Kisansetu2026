import React from "react";

export default function StatsCard({ bookings = [] }) {
  const total = bookings.length;

  const pending = bookings.filter(
    (b) => (b.booking_status || b.status) === "Pending"
  ).length;

  const accepted = bookings.filter(
    (b) => (b.booking_status || b.status) === "Accepted"
  ).length;

  const running = bookings.filter(
    (b) => (b.booking_status || b.status) === "Running"
  ).length;

  const completed = bookings.filter(
    (b) => (b.booking_status || b.status) === "Completed"
  ).length;

  const cancelled = bookings.filter(
    (b) => (b.booking_status || b.status) === "Cancelled"
  ).length;

  const revenue = bookings
    .filter((b) => (b.booking_status || b.status) === "Completed")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: 15,
        marginBottom: 20,
      }}
    >
      <Card title="📋 Total Bookings" value={total} />
      <Card title="⏳ Pending" value={pending} />
      <Card title="✅ Accepted" value={accepted} />
      <Card title="🚜 Running" value={running} />
      <Card title="✔️ Completed" value={completed} />
      <Card title="❌ Cancelled" value={cancelled} />
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
        padding: 20,
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
