import React from "react";

export default function DriverMarker({ driver }) {

  if (!driver) return null;

  return (
    <div
      style={{
        background: "#1976D2",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
        margin: 10,
      }}
    >
      🚜 Driver

      <br />

      {driver.lat}

      <br />

      {driver.lng}
    </div>
  );

}
