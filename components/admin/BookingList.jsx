import React from "react";
import { supabase } from "../../lib/supabase";

export default function BookingList({ bookings = [] }) {
  async function updateStatus(id, status) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      alert(`Booking ${status}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  }

  return (
    <div>
      <h2>📋 All Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings available.</p>
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
              🚜 {booking.service_name || booking.serviceName}
            </h3>

            <p>👨 Customer : {booking.customer_name}</p>

            <p>📞 Phone : {booking.customer_phone}</p>

            <p>🌾 Acres : {booking.acres}</p>

            <p>📅 Date : {booking.date}</p>

            <p>💰 Amount : ₹{booking.amount}</p>

            <p>
              📦 Status :
              <b
                style={{
                  color:
                    booking.status === "Completed"
                      ? "green"
                      : booking.status === "Accepted"
                      ? "blue"
                      : booking.status === "Cancelled"
                      ? "red"
                      : "#d97706",
                }}
              >
                {" "}
                {booking.status || "Pending"}
              </b>
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 15,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  updateStatus(booking.id, "Accepted")
                }
              >
                ✅ Accept
              </button>

              <button
                onClick={() =>
                  updateStatus(booking.id, "Running")
                }
              >
                🚜 Running
              </button>

              <button
                onClick={() =>
                  updateStatus(booking.id, "Completed")
                }
              >
                ✔️ Complete
              </button>

              <button
                onClick={() =>
                  updateStatus(booking.id, "Cancelled")
                }
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
