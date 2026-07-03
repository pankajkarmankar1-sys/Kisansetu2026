import React from "react";

export default function BookingSuccess({
  booking,
  backToHome,
  viewBookings,
}) {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>🎉 Booking Successful</h1>

      <p>
        Aapki booking successfully create ho gayi hai.
      </p>

      <br />

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
        }}
      >
        <p><b>Service:</b> {booking?.service?.name}</p>
        <p><b>Amount:</b> ₹{booking?.amount}</p>
        <p><b>Date:</b> {booking?.date}</p>
        <p><b>Payment:</b> ✅ Paid</p>
      </div>

      <button onClick={viewBookings}>
        📋 My Bookings
      </button>

      <button
        onClick={backToHome}
        style={{ marginLeft: 10 }}
      >
        🏠 Home
      </button>
    </div>
  );
}
