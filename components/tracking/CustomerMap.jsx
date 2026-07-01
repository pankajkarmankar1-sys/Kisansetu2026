import React from "react";

export default function CustomerMap({
  booking,
  driverLocation,
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

      <h3>🗺️ Live Map</h3>

      <div
        style={{
          height: 300,
          borderRadius: 10,
          background: "#e8f5e9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 18,
          fontWeight: "bold",
          color: "#2d8a4e",
        }}
      >
        📍 Map Integration Coming Here
      </div>

      <div style={{ marginTop: 15 }}>

        <p>
          <b>Latitude :</b>{" "}
          {driverLocation?.lat || 0}
        </p>

        <p>
          <b>Longitude :</b>{" "}
          {driverLocation?.lng || 0}
        </p>

        <p>
          <b>Booking ID :</b>{" "}
          {booking?.id || "-"}
        </p>

      </div>

    </div>
  );
}
