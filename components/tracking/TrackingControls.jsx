import React from "react";

export default function TrackingControls({
  booking,
  onStart,
  onPause,
  onStop,
  onRefresh,
}) {

  return (

    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 20,
        marginTop: 15,
      }}
    >

      <h3>🎮 Tracking Controls</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 15,
        }}
      >

        <button
          onClick={onStart}
          style={{
            padding: 12,
            background: "#2d8a4e",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ▶️ Start Tracking
        </button>

        <button
          onClick={onPause}
          style={{
            padding: 12,
            background: "#f9a825",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ⏸ Pause
        </button>

        <button
          onClick={onRefresh}
          style={{
            padding: 12,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          📍 Refresh
        </button>

        <button
          onClick={onStop}
          style={{
            padding: 12,
            background: "#d32f2f",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ⛔ Stop
        </button>

      </div>

      <div
        style={{
          marginTop: 20,
          padding: 10,
          background: "#f5f5f5",
          borderRadius: 8,
        }}
      >
        <p><b>Booking ID:</b> {booking?.id || "-"}</p>
        <p><b>Status:</b> {booking?.booking_status || "Tracking"}</p>
      </div>

    </div>

  );

}
