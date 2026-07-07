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

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first.");
        return;
      }

      const amount =
        (bookingData?.selectedService?.normalPrice || 0) *
        Number(bookingData?.acres || 0);

      const { error } = await supabase
        .from("bookings")
        .insert([
          {
            customer_id: user.id,
            service_name: bookingData?.selectedService?.name,
            acres: Number(bookingData?.acres),
            booking_date: bookingData?.date,
            amount: amount,
            payment_status:
              bookingData?.payment_status || "Pending",
            status: "Pending",
            note: bookingData?.note || "",
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      alert("✅ Booking Successful");

      if (onConfirm) onConfirm();
    } catch (err) {
      console.error(err);
      alert(err.message);
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
          padding: 15,
          borderRadius: 12,
          marginTop: 20,
        }}
      >
        <p>🚜 Service: {bookingData?.selectedService?.name}</p>
        <p>🌾 Acres: {bookingData?.acres}</p>
        <p>📅 Date: {bookingData?.date}</p>
        <p>💰 Amount: ₹{amount}</p>
        <p>💳 Payment: {bookingData?.payment_status}</p>
        <p>📝 Note: {bookingData?.note || "-"}</p>
      </div>

      <button
        onClick={handleConfirm}
        disabled={loading}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 15,
          border: "none",
          borderRadius: 12,
          background: "#16a34a",
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {loading ? "Booking..." : "✅ Confirm Booking"}
      </button>
    </div>
  );
}
