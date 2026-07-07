import React from "react";

export default function BookingSuccess({
  bookingData,
  onDone,
}) {
  return (
    <div
      style={{
        padding: 20,
        textAlign: "center",
        background: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <h1>🎉 Booking Successful</h1>

      <p>
        Aapki booking successfully create ho gayi hai.
      </p>

      <br />

      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
          textAlign: "left",
        }}
      >

        <p>
          <b>🚜 Service:</b>
          {" "}
          {bookingData?.selectedService?.name || "-"}
        </p>

        <p>
          <b>🌾 Acres:</b>
          {" "}
          {bookingData?.acres || 0}
        </p>

        <p>
          <b>💰 Amount:</b>
          {" "}
          ₹{bookingData?.amount || 0}
        </p>

        <p>
          <b>📅 Date:</b>
          {" "}
          {bookingData?.date || "-"}
        </p>

        <p>
          <b>💳 Payment:</b>
          {" "}
          {bookingData?.payment_status || "Pending"}
        </p>

      </div>

      <button
        onClick={onDone}
        style={{
          padding: 12,
          width: "100%",
        }}
      >
        🏠 Home
      </button>

    </div>
  );
}
