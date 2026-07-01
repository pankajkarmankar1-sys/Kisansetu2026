import React from "react";

export default function AssignDriver({
  booking,
  drivers = [],
  onAssign,
}) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 15,
        marginTop: 15,
      }}
    >
      <h3>🚜 Assign Driver</h3>

      <p>
        Booking :
        <b> {booking?.service_name || booking?.serviceName}</b>
      </p>

      {drivers.length === 0 ? (
        <p>No Driver Available</p>
      ) : (
        drivers.map((driver) => (
          <button
            key={driver.id}
            onClick={() => onAssign(driver)}
            style={{
              display: "block",
              width: "100%",
              marginTop: 10,
              padding: 10,
            }}
          >
            👨‍🌾 {driver.name} ({driver.phone})
          </button>
        ))
      )}
    </div>
  );
}
