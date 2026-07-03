import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverHistory({ bookings = [] }) {

  const [history, setHistory] = useState([]);

useEffect(() => {
  loadHistory();
}, []);

async function loadHistory() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("status", "Completed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setHistory(data || []);
}

  return (
    <div style={{ padding: 20 }}>

      <h2>📜 Driver History</h2>

      {history.length === 0 ? (

        <p>No completed bookings.</p>

      ) : (

        history.map((booking) => (

          <div
            key={booking.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 15,
              marginBottom: 15,
              background: "#fff",
            }}
          >

            <h3>
              🚜 {booking.service_name || booking.serviceName}
            </h3>

            <p>👤 Customer : {booking.customer_name}</p>

            <p>📞 Phone : {booking.customer_phone}</p>

            <p>📅 Date : {booking.date}</p>

            <p>🌾 Acres : {booking.acres}</p>

            <p>💰 Amount : ₹{booking.amount}</p>

            <p>
  ✅ Status :
  <b
    style={{
      color:
        booking.status === "Completed"
          ? "green"
          : booking.status === "Accepted"
          ? "blue"
          : "orange",
    }}
  >
    {booking.status}
  </b>
</p>

          </div>

        ))

      )}

    </div>
  );
}
