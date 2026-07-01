import React, { useEffect, useState } from "react";
import BookingList from "./BookingList";
import StatsCard from "./StatsCard";

export default function AdminDashboard() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {

    // Supabase se baad me data aayega

    setBookings([]);

  }

  return (

    <div style={{ padding:20 }}>

      <h1>🛠 Admin Dashboard</h1>

      <StatsCard bookings={bookings} />

      <BookingList bookings={bookings} />

    </div>

  );

}
