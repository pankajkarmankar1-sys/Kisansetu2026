import React from "react";

export default function MapView({ children }) {
  return (
    <div
      style={{
        height: 400,
        borderRadius: 12,
        border: "1px solid #ddd",
        background: "#eef7ee",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          fontWeight: "bold",
        }}
      >
        🗺️ Map View
      </div>

      {children}
    </div>
  );
}
