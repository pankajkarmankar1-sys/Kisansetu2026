import React, { useState, useEffect } from "react";
import DriverBookingCard from "./DriverBookingCard";
import { supabase } from "../../lib/supabase";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();

    const channel = supabase
      .channel("customer-bookings")
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
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setBookings([]);
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(id) {
    const ok = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("bookings")
      .update({
        status: "Cancelled",
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Booking cancelled successfully");

    loadBookings();
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 My Bookings</h2>

      <button
        onClick={loadBookings}
        style={{
          marginBottom: 20,
          padding: "10px 16px",
          border: "none",
          borderRadius: 8,
          background: "#16a34a",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        🔄 Refresh
      </button>

      {bookings.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            textAlign: "center",
          }}
        >
          <h3>No bookings found.</h3>
        </div>
      ) : (
        bookings.map((booking) => (
          <DriverBookingCard
            key={booking.id}
            booking={booking}
            onCancel={cancelBooking}
          />
        ))
      )}
    </div>
  );
}
