import React from "react";

export default function DriverProfile({ driver }) {

  return (

    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 20,
      }}
    >

      <h2>👨‍🌾 Driver Profile</h2>

      <p>
        <b>Name :</b> {driver?.name || "-"}
      </p>

      <p>
        <b>Phone :</b> {driver?.phone || "-"}
      </p>

      <p>
        <b>Village :</b> {driver?.village || "-"}
      </p>

      <p>
        <b>Vehicle :</b> {driver?.vehicle_type || "Tractor"}
      </p>

      <p>
        <b>Experience :</b> {driver?.experience || "0"} Years
      </p>

      <p>
        <b>Rating :</b> ⭐ {driver?.rating || "New"}
      </p>

      <p>
        <b>Status :</b>{" "}
        <span
          style={{
            color: "#2d8a4e",
            fontWeight: "bold",
          }}
        >
          {driver?.status || "Available"}
        </span>
      </p>

      <button
        style={{
          marginTop: 15,
          padding: "10px 20px",
          background: "#2d8a4e",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        ✏️ Edit Profile
      </button>

    </div>

  );

}
