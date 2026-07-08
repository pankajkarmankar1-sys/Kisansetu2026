import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverEarnings({ driver }) {

  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (driver?.id) {
      loadEarnings();
    }
  }, [driver]);

  async function loadEarnings() {

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("driver_id", driver.id)
      .eq("status", "Completed")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setBookings(data || []);

    let sum = 0;

    (data || []).forEach((booking) => {
      sum += Number(
        booking.total_amount ||
        booking.amount ||
        booking.price ||
        0
      );
    });

    setTotal(sum);
  }

  return (
    <div>

      <h2>💰 Driver Earnings</h2>

      <h3>
        Total Earnings: ₹{total}
      </h3>

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
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >

          <h3>{booking.service_name}</h3>

          <p>
            Customer: {booking.customer_name}
          </p>

          <p>
            Date: {booking.booking_date || booking.date}
          </p>

          <p>
            Amount: ₹
            {
              booking.total_amount ||
              booking.amount ||
              booking.price ||
              0
            }
          </p>

        </div>

      ))}

    </div>
  );
}
