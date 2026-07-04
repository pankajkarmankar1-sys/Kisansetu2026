import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ConfirmBooking({
  bookingData,
  onConfirm,
  back,
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const amount =
        (bookingData?.selectedService?.normalPrice || 0) *
        Number(bookingData?.acres || 0);

      const { error } = await supabase
        .from("bookings")
        .insert([
          {
            service_name: bookingData?.selectedService?.name,
            acres: Number(bookingData?.acres),
            date: bookingData?.date,
            amount: amount,
            payment_status: bookingData?.payment_status || "Paid",
            status: "Pending",
            note: bookingData?.note || "",
          },
        ]);

      if (error) throw error;

      alert("✅ Booking Successful");
      onConfirm();
    } catch (err) {
      console.error(err);
      alert("Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  const amount =
    (bookingData?.selectedService?.normalPrice || 0) *
    Number(bookingData?.acres || 0);

  return (
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <button onClick={back}>← Back</button>

      <h2>✅ Confirm Booking</h2>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 15,
          marginTop: 20,
        }}
      >
        <p>🚜 Service : {bookingData?.selectedService?.name}</p>

        <p>🌾 Acres : {bookingData?.acres}</p>

        <p>📅 Date : {bookingData?.date}</p>

        <p>💰 Amount : ₹{amount}</p>

        <p>
          💳 Payment : {bookingData?.payment_status || "Paid"}
        </p>

        <p>📝 Note : {bookingData?.note || "-"}</p>
      </div>

      <button
        onClick={handleConfirm}
        disabled={loading}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 14,
          border: "none",
          borderRadius: 10,
          background: "#2d8a4e",
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {loading ? "Booking..." : "✅ Confirm Booking"}
      </button>
    </div>
  );
}          borderRadius:10,
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
