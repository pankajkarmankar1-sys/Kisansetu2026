import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LocationSelector({ onSelect }) {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const navigate = useNavigate();
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

    if (onSelect) {
      onSelect(locationData);
    }

    console.log("Location Saved:", locationData);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationData = {
          state: "Current Location",
          district: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };

        if (onSelect) {
          onSelect(locationData);
        }

        console.log("GPS Location:", locationData);
      },
      (error) => {
        console.log(error);
        alert("Location permission denied or error occurred");
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
        fontFamily: "Arial",
      }}
    >
      <h2 style={{ marginBottom: 15 }}>📍 Select Location</h2>

      {/* State */}
      <div style={{ marginBottom: 10 }}>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
          }}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="Enter District"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "#2d8a4e",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Save
        </button>

        <button
          onClick={useCurrentLocation}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "#1e88e5",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          GPS
        </button>
      </div>
    </div>
  );
}
