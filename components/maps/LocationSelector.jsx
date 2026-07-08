// components/maps/LocationSelector.jsx

import React, { useState } from "react";
import chandrapur from "../../data/chandrapur";

export default function LocationSelector({ onSelect }) {
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);

  const talukas = Object.keys(chandrapur.talukas);

  const villages =
    taluka && chandrapur.talukas[taluka]
      ? chandrapur.talukas[taluka]
      : [];

  function saveLocation(data) {
    localStorage.setItem(
      "location",
      JSON.stringify(data)
    );

    if (onSelect) {
      onSelect(data);
    }
  }

  function handleSave() {
    if (!taluka || !village) {
      alert("Taluka aur Village select kare.");
      return;
    }

    saveLocation({
      state: chandrapur.state,
      district: chandrapur.district,
      taluka,
      village,
    });
  }
    function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("GPS available nahi hai.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveLocation({
          state: chandrapur.state,
          district: chandrapur.district,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoading(false);
      },
      () => {
        alert("Location permission denied.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

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
      <h2>📍 Select Farm Location</h2>

      <div style={{ marginBottom: 10 }}>
        <strong>State:</strong> {chandrapur.state}
      </div>

      <div style={{ marginBottom: 15 }}>
        <strong>District:</strong> {chandrapur.district}
      </div>

      <select
        value={taluka}
        onChange={(e) => {
          setTaluka(e.target.value);
          setVillage("");
        }}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      >
        <option value="">Select Taluka</option>

        {talukas.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select> 
            <select
        value={village}
        onChange={(e) => setVillage(e.target.value)}
        disabled={!taluka}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15,
        }}
      >
        <option value="">Select Village</option>

        {villages.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: 12,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        Save Location
      </button>

      <button
        onClick={useCurrentLocation}
        disabled={loading}
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
        {loading ? "Getting GPS..." : "📍 Use GPS"}
      </button>
    </div>
  );
}
