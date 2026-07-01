import React, { useState } from "react";

export default function CustomerLocation({ onLocationSelect }) {

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  function getCurrentLocation() {

    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(loc);

        if (onLocationSelect) {
          onLocationSelect(loc);
        }

        setLoading(false);

      },

      () => {

        alert("Location permission denied");

        setLoading(false);

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

      <h3>📍 Customer Current Location</h3>

      <button
        onClick={getCurrentLocation}
      >
        {loading ? "Getting Location..." : "📍 Use Current Location"}
      </button>

      {location && (

        <div style={{ marginTop: 15 }}>

          <p>Latitude : {location.lat}</p>

          <p>Longitude : {location.lng}</p>

        </div>

      )}

    </div>

  );

}
