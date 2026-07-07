import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverBookings({ driver }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();

    const channel = supabase
      .channel("driver-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        loadBookings
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .in("status", ["Pending", "Accepted", "In Progress"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    const update = { status };

    if (status === "Accepted") {
      update.driver_id = driver?.id;
      update.driver_name = driver?.name;
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

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>🚜 Driver Bookings</h2>

      <button
        onClick={loadBookings}
        style={{
          marginBottom: 20,
          padding: 10,
        }}
      >
        🔄 Refresh
      </button>

      {bookings.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
          }}
        >
          <h3>{b.service_name}</h3>

          <p>👤 {b.customer_name || "-"}</p>

          <p>📞 {b.customer_phone || "-"}</p>

          <p>🌾 Acres: {b.acres}</p>

          <p>📅 {b.booking_date || b.date}</p>

          <p>💰 ₹{b.amount}</p>

          <p>
            <b>Status:</b> {b.status}
          </p>

          {b.status === "Pending" && (
            <>
              <button onClick={() => updateStatus(b.id, "Accepted")}>
                ✅ Accept
              </button>

              <button
                style={{ marginLeft: 10 }}
                onClick={() => updateStatus(b.id, "Rejected")}
              >
                ❌ Reject
              </button>
            </>
          )}

          {b.status === "Accepted" && (
            <button
              onClick={() => updateStatus(b.id, "In Progress")}
            >
              ▶️ Start Work
            </button>
          )}

          {b.status === "In Progress" && (
            <button
              onClick={() => updateStatus(b.id, "Completed")}
            >
              ✔️ Complete Work
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
