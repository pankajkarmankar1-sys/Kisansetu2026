import React, { useEffect } from "react";

export default function DriverLocation({
  driver,
  onLocationChange,
}) {

  useEffect(() => {

    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(

      (position) => {

        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        onLocationChange(location);

      },

      (error) => {

        console.error(error);

      },

      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }

    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [onLocationChange]);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 15,
        marginTop: 15,
      }}
    >
      <h3>📍 Driver Live Location</h3>

      <p>
        Driver: <b>{driver?.name || "Unknown Driver"}</b>
      </p>

      <p>
        GPS tracking is active...
      </p>
    </div>
  );
}
