import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverEarnings({ driver }) {

  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!driver?.id) return;

    loadCompletedBookings();

  }, [driver]);



  async function loadCompletedBookings() {

    try {

      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("driver_id", driver.id)
        .eq("status", "Completed");


      if (error) {
        throw error;
      }


      setCompleted(data || []);


    } catch (error) {

      console.error(
        "Earnings Error:",
        error.message
      );


    } finally {

      setLoading(false);

    }
  }



  const totalEarnings = completed.reduce(
    (sum, b) =>
      sum + Number(
        b.driver_amount || b.amount || 0
      ),
    0
  );


  const totalJobs = completed.length;



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
        💰 Driver Earnings
      </h2>


      {loading && (
        <p>
          Loading...
        </p>
      )}



      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          marginBottom: 15,
          background: "#fff",
        }}
      >

        <h3>
          Total Earnings
        </h3>

        <h1>
          ₹{totalEarnings}
        </h1>

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

        <h3>
          Total Completed Jobs
        </h3>

        <h1>
          {totalJobs}
        </h1>

      </div>



      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          background: "#fff",
        }}
      >

        <h3>
          Average Per Job
        </h3>

        <h1>
          ₹
          {
            totalJobs === 0
            ? 0
            : Math.round(
                totalEarnings / totalJobs
              )
          }
        </h1>

      </div>


    </div>
  );
}
