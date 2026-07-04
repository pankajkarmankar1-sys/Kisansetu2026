import React, { useState } from "react";

export default function LocationSelector({ onSelect }) {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const states = [
    "Maharashtra",
    "Madhya Pradesh",
    "Uttar Pradesh",
    "Bihar",
    "Rajasthan",
    "Gujarat",
    "Karnataka",
    "Tamil Nadu",
    "West Bengal",
    "Delhi",
  ];

  const handleSave = () => {
    if (!state || !district) {
      alert("Please select State and enter District");
      return;
    }

    const locationData = {
      state,
      district,
    };

    localStorage.setItem("location", JSON.stringify(locationData));

    console.log("Location Saved:", locationData);

    if (onSelect) {
      onSelect(locationData);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          state: "Current Location",
          district: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
        };

        localStorage.setItem("location", JSON.stringify(locationData));

        console.log("GPS Location:", locationData);

        if (onSelect) {
          onSelect(locationData);
        }
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "20px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 10,
        background: "#fff",
      }}
    >
      <h2>📍 Select Location</h2>

      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      >
        <option value="">Select State</option>

        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Enter District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      />

      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 10,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Save
      </button>

      <button
        onClick={useCurrentLocation}
        style={{
          width: "100%",
          padding: 12,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Use GPS
      </button>
    </div>
  );
}
