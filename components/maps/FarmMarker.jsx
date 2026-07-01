import React from "react";

export default function FarmMarker({ farm }) {

  if (!farm) return null;

  return (
    <div
      style={{
        background: "#4CAF50",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
        margin: 10,
      }}
    >
      🌾 Farm

      <br />

      {farm.lat}

      <br />

      {farm.lng}
    </div>
  );

}
