import React, { useState } from "react";

export default function ConfirmBooking({
  booking,
  onConfirm,
  onBack,
}) {

  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {

    setLoading(true);

    setTimeout(() => {

      onConfirm();

    },1000);

  };

  return (

    <div style={{
      background:"#F8FAFC",
      minHeight:"100vh",
      padding:20
    }}>

      <button onClick={onBack}>
        ← Back
      </button>

      <h2>
        ✅ Confirm Booking
      </h2>

      <div style={{
        background:"#fff",
        borderRadius:12,
        padding:15,
        marginTop:20
      }}>

        <p>
          🚜 Service :
          {" "}
          {booking?.service?.n}
        </p>

        <p>
          🌾 Acres :
          {" "}
          {booking?.acres}
        </p>

        <p>
          📅 Date :
          {" "}
          {booking?.date}
        </p>

        <p>
          💰 Amount :
          ₹{booking?.amount}
        </p>

        <p>
          💳 Payment :
          {booking?.payment_status}
        </p>

        <p>
          📍 Farm :
          {booking?.khet?.name}
        </p>

      </div>

      <button
        onClick={handleConfirm}
        disabled={loading}
        style={{
          marginTop:20,
          width:"100%",
          padding:14,
          border:"none",
          borderRadius:10,
          background:"#2d8a4e",
          color:"#fff",
          fontSize:16,
          fontWeight:"bold"
        }}
      >

        {loading
          ? "Booking..."
          : "✅ Confirm Booking"}

      </button>

    </div>

  );

}
