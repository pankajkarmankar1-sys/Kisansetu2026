import React from "react";
import { S } from "../../styles";

export default function DriverBookingCard({ booking, onView }) {
  return (
    <div style={S.card}>

      <h3>
        🚜  {booking?.service_name || booking?.serviceName || booking?.service?.n || booking?.service || "Tractor Service"}
      </h3>

      <p>📅 Date : {booking?.date || "-"}</p>

      <p>🌾 Acres : {booking?.acres || 0}</p>

      <p>💰 Amount : ₹{booking?.amount || 0}</p>

      <p>
        📦 Status :
        <b style={{ color: "#2d8a4e" }}>
          {" "}
          {booking?.booking_status || booking?.status || "Pending"}
        </b>
      </p>

      <p>
        👨‍🌾 Driver :
        {" "}
        {booking?.driverName || "Not Assigned"}
      </p>

      <button
        style={S.btnG}
        onClick={() => onView && onView(booking)}
      >
        View Details
      </button>

    </div>
  );
}
