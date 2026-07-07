import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverHistory({ driver }) {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!driver?.id) return;

    loadHistory();

  }, [driver]);



  async function loadHistory() {

    try {

      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("driver_id", driver.id)
        .eq("status", "Completed")
        .order("created_at", {
          ascending: false,
        });


      if (error) {
        throw error;
      }


      setHistory(data || []);


    } catch (error) {

      console.error(
        "History Error:",
        error.message
      );


    } finally {

      setLoading(false);

    }
  }



  if (!driver?.id) {
    return (
      <p>
        Driver login nahi hai
      </p>
    );
  }



  return (
    <div
      style={{
        padding: 20,
      }}
    >

      <h2>
        📜 Driver History
      </h2>


      {loading && (
        <p>
          Loading...
        </p>
      )}



      {!loading && history.length === 0 && (
        <p>
          No completed bookings.
        </p>
      )}



      {history.map((booking) => (

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
            🚜 {booking.service_name || "-"}
          </h3>


          <p>
            👤 Customer:
            {" "}
            {booking.customer_name || "-"}
          </p>


          <p>
            📞 Phone:
            {" "}
            {booking.customer_phone || "-"}
          </p>


          <p>
            📅 Date:
            {" "}
            {booking.booking_date || "-"}
          </p>


          <p>
            🌾 Acres:
            {" "}
            {booking.acres || 0}
          </p>


          <p>
            💰 Amount:
            {" "}
            ₹{booking.amount || 0}
          </p>


          <p>
            ✅ Status:
            {" "}
            <b style={{ color: "green" }}>
              {booking.status}
            </b>
          </p>


        </div>

      ))}

    </div>
  );
}
