import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverEarnings({ driver, bookings = [] }) {

  const [completed, setCompleted] = useState([]);

useEffect(() => {
  loadCompletedBookings();
}, []);

async function loadCompletedBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("status", "Completed");

  if (error) {
    console.error(error);
    return;
  }

  setCompleted(data || []);
}

const totalEarnings = completed.reduce(
  (sum, b) => sum + Number(b.driver_amount || b.amount || 0),
  0
);

const totalJobs = completed.length;
  return (
    <div style={{ padding: 20 }}>

      <h2>💰 Driver Earnings</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          marginBottom: 15,
          background: "#fff",
        }}
      >
        <h3>Total Earnings</h3>

        <h1>₹{totalEarnings}</h1>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          marginBottom: 15,
          background: "#fff",
        }}
      >
        <h3>Total Completed Jobs</h3>

        <h1>{totalJobs}</h1>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          background: "#fff",
        }}
      >
        <h3>Average Per Job</h3>

        <h1>
          ₹
          {totalJobs === 0
            ? 0
            : Math.round(totalEarnings / totalJobs)}
        </h1>
      </div>

    </div>
  );
}
