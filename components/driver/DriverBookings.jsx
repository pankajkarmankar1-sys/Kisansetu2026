import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverBookings({ driver }) {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!driver?.id) return;

    loadBookings();

    const channel = supabase
      .channel(`driver_bookings_${driver.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          loadBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [driver]);



  async function loadBookings() {

    if (!driver?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("driver_id", driver.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error.message);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  }



  async function updateStatus(booking, status) {

    const { error } = await supabase
      .from("bookings")
      .update({
        status,
      })
      .eq("id", booking.id);

    if (error) {
      alert(error.message);
      return;
    }

    // Customer Notification

    if (booking.customer_id) {

      let message = "Booking status updated.";

      if (status === "Accepted") {
        message = "🚜 Driver accepted your booking.";
      }

      else if (status === "In Progress") {
        message = "🚜 Your tractor work has started.";
      }

      else if (status === "Completed") {
        message = "✅ Your tractor service is completed.";
      }

      else if (status === "Rejected") {
        message = "❌ Driver rejected your booking.";
      }

      else if (status === "Cancelled") {
        message = "❌ Your booking has been cancelled.";
      }

      await supabase
        .from("notifications")
        .insert([
          {
            user_id: booking.customer_id,
            title: `Booking ${status}`,
            message,
            created_at: new Date().toISOString(),
          },
        ]);
    }

    loadBookings();
  }
  if (loading) {
    return <h3>Loading Bookings...</h3>;
  }

  return (
    <div>

      <h2>🚜 My Bookings</h2>

      {bookings.length === 0 && (
        <p>No bookings assigned.</p>
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
            <b>Customer:</b>{" "}
            {booking.customer_name || "-"}
          </p>

          <p>
            <b>Phone:</b>{" "}
            {booking.customer_phone || "-"}
          </p>

          <p>
            <b>Date:</b>{" "}
            {booking.booking_date || booking.date}
          </p>

          <p>
            <b>Village:</b>{" "}
            {booking.village || "-"}
          </p>

          <p>
            <b>Status:</b>{" "}
            {booking.status}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 15,
            }}
          >

            {booking.status === "Pending" && (
              <button
                onClick={() =>
                  updateStatus(
                    booking,
                    "Accepted"
                  )
                }
              >
                ✅ Accept
              </button>
            )}

            {booking.status === "Accepted" && (
              <button
                onClick={() =>
                  updateStatus(
                    booking,
                    "In Progress"
                  )
                }
              >
                🚜 Start Work
              </button>
            )}

            {booking.status === "In Progress" && (
              <button
                onClick={() =>
                  updateStatus(
                    booking,
                    "Completed"
                  )
                }
              >
                ✅ Complete
              </button>
            )}

            <button
              onClick={() =>
                updateStatus(
                  booking,
                  "Rejected"
                )
              }
            >
              ❌ Reject
            </button>

            {booking.customer_phone && (
              <a
                href={`tel:${booking.customer_phone}`}
              >
                <button>
                  📞 Call Customer
                </button>
              </a>
            )}

          </div>

        </div>

      ))}
      ))}
    </div>
  );
}
