import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverHistory({ driver }) {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (driver?.id) {
      loadHistory();
    }
  }, [driver]);

  async function loadHistory() {

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("driver_id", driver.id)
      .in("status", ["Completed", "Rejected"])
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setHistory(data || []);
  }

  return (
    <div>

      <h2>📜 Booking History</h2>

      {history.length === 0 && (
        <p>No history found.</p>
      )}

      {history.map((booking) => (

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
            <b>Customer:</b> {booking.customer_name || "-"}
          </p>

          <p>
            <b>Date:</b> {booking.booking_date || "-"}
          </p>

          <p>
            <b>Status:</b> {booking.status}
          </p>

          <p>
            <b>Amount:</b> ₹{booking.total_amount || 0}
          </p>

        </div>

      ))}

    </div>
  );
}
