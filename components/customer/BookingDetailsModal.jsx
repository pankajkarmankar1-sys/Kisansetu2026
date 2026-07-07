import React from "react";

export default function BookingDetailsModal({
  booking,
  onClose,
}) {

  if (!booking) return null;


  return (
    <div
      style={{
        position:"fixed",
        inset:0,
        background:"rgba(0,0,0,.5)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        zIndex:999,
      }}
    >

      <div
        style={{
          background:"#fff",
          width:"90%",
          maxWidth:450,
          padding:20,
          borderRadius:15,
        }}
      >

        <h2>
          📋 Booking Details
        </h2>


        <p>
          🚜 <b>Service:</b> {booking.service_name}
        </p>

        <p>
          📅 <b>Date:</b> {booking.booking_date || "-"}
        </p>


        <p>
          🌾 <b>Acres:</b> {booking.acres}
        </p>


        <p>
          💰 <b>Amount:</b> ₹{booking.amount}
        </p>


        <p>
          📦 <b>Status:</b> {booking.status}
        </p>


        <p>
          💳 <b>Payment:</b> {booking.payment_status || "Pending"}
        </p>


        <p>
          🚜 <b>Driver:</b> {booking.driver_name || "Not Assigned"}
        </p>


        <p>
          📞 <b>Phone:</b> {booking.driver_phone || "-"}
        </p>


        <p>
          📍 <b>Farm:</b> {booking.farm_location?.name || "-"}
        </p>


        <button
          onClick={onClose}
          style={{
            width:"100%",
            padding:12,
            background:"#dc2626",
            color:"#fff",
            border:"none",
            borderRadius:10,
            fontWeight:"bold",
          }}
        >
          Close
        </button>


      </div>

    </div>
  );
}
