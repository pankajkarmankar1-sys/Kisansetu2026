import React, { useEffect, useState } from "react";

export default function DriverBookings({ driver }) {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {

    // Baad me Supabase se sirf assigned bookings load karenge

    setBookings([]);

  }

  function acceptBooking(id) {
    console.log("Accept", id);
  }

  function rejectBooking(id) {
    console.log("Reject", id);
  }

  return (

    <div>

      <h2>🚜 My Bookings</h2>

      {bookings.length === 0 ? (

        <p>No bookings assigned.</p>

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

            <h3>
              {booking.service_name || booking.serviceName}
            </h3>

            <p>👤 {booking.customer_name}</p>

            <p>📞 {booking.customer_phone}</p>

            <p>🌾 {booking.acres} Acre</p>

            <p>📅 {booking.date}</p>

            <p>💰 ₹{booking.amount}</p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >

              <button
                onClick={() => acceptBooking(booking.id)}
              >
                ✅ Accept
              </button>

              <button
                onClick={() => rejectBooking(booking.id)}
              >
                ❌ Reject
              </button>

            </div>

          </div>

        ))

      )}

    </div>

  );

}
