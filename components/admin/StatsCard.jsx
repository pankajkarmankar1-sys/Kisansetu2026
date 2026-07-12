import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function StatsCard() {

  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    assigned: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
    drivers: 0,
    customers: 0,
    revenue: 0,
  });

  useEffect(() => {

    loadStats();

    const channel = supabase
      .channel("stats-update")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  async function loadStats() {

    try {

      const {
        data: bookings,
        error,
      } = await supabase
        .from("bookings")
        .select("*");

      if (error) throw error;

      const {
        count: drivers,
      } = await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "driver");

      const {
        count: farmer,
      } = await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "farmer");

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const revenue =
        (bookings || [])
          .filter(
            (b) =>
              b.status === "Completed"
          )
          .reduce(
            (sum, b) =>
              sum +
              Number(
                b.total_amount ||
                b.amount ||
                0
              ),
            0
          );

      setStats({

        total:
          bookings?.length || 0,

        today:
          bookings?.filter(
            (b) =>
              b.created_at?.startsWith(today)
          ).length || 0,

        pending:
          bookings?.filter(
            (b) =>
              b.status === "Pending"
          ).length || 0,

        assigned:
          bookings?.filter(
            (b) =>
              b.status === "Assigned"
          ).length || 0,

        accepted:
          bookings?.filter(
            (b) =>
              b.status === "Accepted"
          ).length || 0,
        completed:
          bookings?.filter(
            (b) =>
              b.status === "Completed"
          ).length || 0,

        cancelled:
          bookings?.filter(
            (b) =>
              b.status === "Cancelled"
          ).length || 0,

        drivers:
          drivers || 0,

        customers:
          farmer || 0,

        revenue,

      });

    } catch (err) {

      console.log(
        "Stats Error:",
        err.message
      );

    }

  }

  const card = {
    flex: "1 1 200px",
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,.1)",
    textAlign: "center",
  };

  return (

    <div>

      <button
        onClick={loadStats}
        style={{
          marginBottom: 15,
          padding: 10,
          border: "none",
          borderRadius: 8,
          background: "#16a34a",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🔄 Refresh Stats
      </button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={card}>
          <h3>📋 Total Bookings</h3>
          <h1>{stats.total}</h1>
        </div>

        <div style={card}>
          <h3>📅 Today's Bookings</h3>
          <h1>{stats.today}</h1>
        </div>

        <div style={card}>
          <h3>⏳ Pending</h3>
          <h1>{stats.pending}</h1>
        </div>

        <div style={card}>
          <h3>🚜 Assigned</h3>
          <h1>{stats.assigned}</h1>
        </div>

        <div style={card}>
          <h3>👍 Accepted</h3>
          <h1>{stats.accepted}</h1>
        </div>

        <div style={card}>
          <h3>✅ Completed</h3>
          <h1>{stats.completed}</h1>
        </div>

        <div style={card}>
          <h3>❌ Cancelled</h3>
          <h1>{stats.cancelled}</h1>
        </div>

        <div style={card}>
          <h3>👨‍🌾 Farmers</h3>
          <h1>{stats.customers}</h1>
        </div>

        <div style={card}>
          <h3>🚜 Drivers</h3>
          <h1>{stats.drivers}</h1>
        </div>

        <div style={card}>
          <h3>💰 Total Revenue</h3>
          <h1>₹{stats.revenue}</h1>
        </div>

      </div>

    </div>

  );

}
