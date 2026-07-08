import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CustomerHistory({ user }) {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadBookings();
    }
  }, [user]);

  async function loadBookings() {

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setBookings(data || []);
  }

  return (
    <div>

      <h2>📋 My Bookings</h2>

      {bookings.length === 0 && (
        <p>No bookings found.</p>
      )}

      {bookings.map((booking) => (

        <div
          key={booking.id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 15,
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >

          <h3>{booking.service_name}</h3>

          <p>
            <b>Date:</b> {booking.booking_date}
          </p>

          <p>
            <b>Status:</b> {booking.status}
          </p>

          <p>
            <b>Driver:</b> {booking.driver_name || "Not Assigned"}
          </p>

          <p>
            <b>Amount:</b> ₹{booking.total_amount || 0}
          </p>

          {booking.driver_phone && (
            <a href={`tel:${booking.driver_phone}`}>
              <button
                style={{
                  marginTop: 10,
                  padding: "10px 20px",
                }}
              >
                📞 Call Driver
              </button>
            </a>
          )}

        </div>

      ))}

    </div>
  );
}
