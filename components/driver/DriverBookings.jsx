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
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .or(
          `status.eq.Pending,driver_id.eq.${driver.id}`
        )
        .order("created_at", {
          ascending: false,
        });


      if (error) {
        throw error;
      }

      setBookings(data || []);

    } catch (err) {
      console.error(
        "Booking Load Error:",
        err
      );

    } finally {
      setLoading(false);
    }
  }


  async function updateStatus(id, status) {

    const update = {
      status,
    };


    if (status === "Accepted") {
      update.driver_id = driver.id;
      update.driver_name = driver.name || "";
    }


    const { error } = await supabase
      .from("bookings")
      .update(update)
      .eq("id", id);


    if (error) {
      alert(error.message);
      return;
    }


    loadBookings();
  }


  if (!driver?.id) {
    return (
      <div>
        Driver login nahi hai
      </div>
    );
  }


  if (loading) {
    return (
      <h2>
        Loading...
      </h2>
    );
  }


  return (
    <div
      style={{
        padding: 20,
      }}
    >

      <h2>
        🚜 Driver Bookings
      </h2>


      <button
        onClick={loadBookings}
        style={{
          marginBottom: 20,
          padding: 10,
        }}
      >
        🔄 Refresh
      </button>


      {bookings.length === 0 && (
        <p>
          Koi booking nahi hai
        </p>
      )}


      {bookings.map((b) => (

        <div
          key={b.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
            background: "#fff",
          }}
        >

          <h3>
            {b.service_name}
          </h3>


          <p>
            👤 Customer:
            {" "}
            {b.customer_name || "-"}
          </p>


          <p>
            📞 Phone:
            {" "}
            {b.customer_phone || "-"}
          </p>


          <p>
            🌾 Acres:
            {" "}
            {b.acres}
          </p>


          <p>
            📅 Date:
            {" "}
            {b.booking_date || "-"}
          </p>


          <p>
            💰 Amount:
            {" "}
            ₹{b.amount}
          </p>


          <p>
            <b>Status:</b>
            {" "}
            {b.status}
          </p>



          {b.status === "Pending" && (
            <>
              <button
                onClick={() =>
                  updateStatus(
                    b.id,
                    "Accepted"
                  )
                }
              >
                ✅ Accept
              </button>


              <button
                style={{
                  marginLeft: 10,
                }}
                onClick={() =>
                  updateStatus(
                    b.id,
                    "Rejected"
                  )
                }
              >
                ❌ Reject
              </button>
            </>
          )}



          {b.status === "Accepted" && (
            <button
              onClick={() =>
                updateStatus(
                  b.id,
                  "In Progress"
                )
              }
            >
              ▶️ Start Work
            </button>
          )}



          {b.status === "In Progress" && (
            <button
              onClick={() =>
                updateStatus(
                  b.id,
                  "Completed"
                )
              }
            >
              ✔️ Complete Work
            </button>
          )}


        </div>

      ))}

    </div>
  );
}
