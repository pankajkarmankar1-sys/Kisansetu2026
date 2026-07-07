import React from "react";
import { S } from "../../styles";

export default function DriverBookingCard({ booking, onView }) {
  const status = booking?.status || "Pending";

  const statusColor = {
    Pending: "#f59e0b",
    Accepted: "#2563eb",
    Completed: "#16a34a",
    Cancelled: "#dc2626",
  };

  return (
    <div
      style={{
        ...S.card,
        marginBottom: 15,
        borderLeft: `6px solid ${statusColor[status] || "#16a34a"}`,
      }}
    >
      <h3>
        🚜 {booking?.service_name || "Tractor Service"}
      </h3>

      <p>
        📅 <b>Date:</b>{" "}
        {booking?.booking_date || booking?.date || "-"}
      </p>

      <p>
        🌾 <b>Acres:</b> {booking?.acres || 0}
      </p>

      <p>
        💰 <b>Amount:</b> ₹{booking?.amount || 0}
      </p>

      <p>
        💳 <b>Payment:</b>{" "}
        {booking?.payment_status || "Pending"}
      </p>

      <p>
        📦 <b>Status:</b>{" "}
        <span
          style={{
            color: statusColor[status] || "#16a34a",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      </p>

      <p>
        🚗 <b>Driver:</b>{" "}
        {booking?.driver_name || booking?.driverName || "Not Assigned"}
      </p>

      {booking?.note && (
        <p>
          📝 <b>Note:</b> {booking.note}
        </p>
      )}

      <button
        style={S.btnG}
        onClick={() => onView && onView(booking)}
      >
        View Details
      </button>
    </div>
  );
}
