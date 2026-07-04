import React, { useState, useEffect } from "react";
import DriverBookingCard from "./DriverBookingCard";
import { supabase } from "../../lib/supabase";

export default function MyBookings({ phone }) {
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
  }, [phone]);

  async function loadBookings() {
    try {
      setLoading(true);

      let query = supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (phone) {
        query = query.eq("customer_phone", phone);
      }

      const { data, error } = await query;

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
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

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <DriverBookingCard
            key={booking.id}
            booking={booking}
          />
        ))
      )}
    </div>
  );
}
