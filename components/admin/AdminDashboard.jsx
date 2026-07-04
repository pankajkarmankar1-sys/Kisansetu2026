import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BookingList from "./BookingList";
import StatsCard from "./StatsCard";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: 20,
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1>🛠 Admin Dashboard</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <>
          <StatsCard bookings={bookings} />
          <BookingList bookings={bookings} />
        </>
      )}
    </div>
  );
}
