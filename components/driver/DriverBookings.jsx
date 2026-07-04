import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverBookings({ driver }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("status", "Pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function acceptBooking(id) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "Accepted",
          driver_id: driver?.id || null,
          driver_name: driver?.name || "",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      alert("✅ Booking Accepted");
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Accept failed");
    }
  }

  async function rejectBooking(id) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "Rejected",
        })
        .eq("id", id);

      if (error) throw error;

      alert("❌ Booking Rejected");
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Reject failed");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🚜 Pending Bookings</h2>

      {bookings.length === 0 ? (
        <p>No pending bookings.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              background: "#fff",
            }}
          >
            <h3>{booking.service_name}</h3>

            <p>👤 Customer: {booking.customer_name || "-"}</p>

            <p>📞 Phone: {booking.customer_phone || "-"}</p>

            <p>🌾 Acres: {booking.acres}</p>

            <p>📅 Date: {booking.date}</p>

            <p>💰 Amount: ₹{booking.amount}</p>

            <p>Status: {booking.status}</p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 15,
              }}
            >
              <button onClick={() => acceptBooking(booking.id)}>
                ✅ Accept
              </button>

              <button onClick={() => rejectBooking(booking.id)}>
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
