import React from "react";

export default function DriverList({
  drivers = [],
  onSelectDriver,
}) {

  return (

    <div>

      <h2>👨‍🌾 Driver List</h2>

      {drivers.length === 0 ? (

        <p>No Drivers Found</p>

      ) : (

        drivers.map((driver) => (

          <div
            key={driver.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              background: "#fff",
            }}
          >

            <h3>{driver.name}</h3>

            <p>📞 {driver.phone}</p>

            <p>📍 {driver.village}</p>

            <p>🚜 {driver.vehicle_type}</p>

            <p>⭐ {driver.rating || "New Driver"}</p>

            <button
              onClick={() => onSelectDriver(driver)}
              style={{
                marginTop: 10,
                padding: "8px 15px",
                background: "#2d8a4e",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Assign Driver
            </button>

          </div>

        ))

      )}

    </div>

  );

}
