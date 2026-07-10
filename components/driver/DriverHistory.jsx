import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverHistory({ driver }) {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (driver?.id) {
      loadBookings();
    }
  }, [driver]);

  async function loadBookings() {

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("driver_id", driver.id)
      .eq("status", "Completed")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    setBookings(data || []);
  }

  return (
    <div>
      <h2>📜 Driver History</h2>

      {bookings.length === 0 && (
        <p>No completed bookings.</p>
      )}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 15,
            borderRadius: 10,
          }}
        >
          <h3>{booking.service_name}</h3>

          <p>Customer: {booking.customer_name || "-"}</p>

          <p>Status: {booking.status}</p>

          <p>Amount: ₹{booking.total_amount || booking.amount || 0}</p>
        </div>
      ))}
    </div>
  );
}
