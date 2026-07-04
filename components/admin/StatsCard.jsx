import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function StatsCards() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    drivers: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("status");

    const { count: driverCount } = await supabase
      .from("drivers")
      .select("*", { count: "exact", head: true });

    if (bookings) {
      setStats({
        total: bookings.length,
        pending: bookings.filter(b => b.status === "pending").length,
        approved: bookings.filter(b => b.status === "approved").length,
        drivers: driverCount || 0,
      });
    }
  }

  const cardStyle = {
    flex: 1,
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        marginBottom: 25,
        flexWrap: "wrap",
      }}
    >
      <div style={cardStyle}>
        <h3>📋 Total Bookings</h3>
        <h1>{stats.total}</h1>
      </div>

      <div style={cardStyle}>
        <h3>⏳ Pending</h3>
        <h1>{stats.pending}</h1>
      </div>

      <div style={cardStyle}>
        <h3>✅ Approved</h3>
        <h1>{stats.approved}</h1>
      </div>

      <div style={cardStyle}>
        <h3>🚜 Drivers</h3>
        <h1>{stats.drivers}</h1>
      </div>
    </div>
  );
}
