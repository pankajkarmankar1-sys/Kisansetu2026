import React, { useState } from "react";

export default function KhetLocationPicker({
  onSave,
}) {

  const [location, setLocation] = useState(null);

  function getFarmLocation() {

    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(loc);

      },

      () => {
        alert("Location permission denied");
      },

      {
        enableHighAccuracy: true,
      }

    );

  }

  return (

    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        border: "1px solid #ddd",
      }}
    >

      <h3>🌾 Khet Location</h3>

      <button
        onClick={getFarmLocation}
      >
        📍 Save Current Farm Location
      </button>

      {location && (

        <div style={{ marginTop: 15 }}>

          <p>Latitude : {location.lat}</p>

          <p>Longitude : {location.lng}</p>

          <button
            onClick={() => onSave && onSave(location)}
          >
            ✅ Save Farm Location
          </button>

        </div>

      )}

    </div>

  );

}
