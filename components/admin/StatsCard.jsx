import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function StatsCards() {

  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    completed: 0,
    drivers: 0,
    customers: 0,
    revenue: 0,
  });


  useEffect(() => {
    loadStats();
  }, []);



  async function loadStats() {

    try {

      const { data: bookings } = await supabase
        .from("bookings")
        .select("*");



      const { count: driverCount } = await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "driver");



      const { count: customerCount } = await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "customer");



      const totalRevenue =
        bookings?.reduce(
          (sum, b) =>
            sum + Number(b.amount || 0),
          0
        ) || 0;



      setStats({

        totalBookings:
          bookings?.length || 0,

        pending:
          bookings?.filter(
            (b) => b.status === "Pending"
          ).length || 0,

        completed:
          bookings?.filter(
            (b) => b.status === "Completed"
          ).length || 0,

        drivers:
          driverCount || 0,

        customers:
          customerCount || 0,

        revenue:
          totalRevenue,

      });


    } catch (error) {

      console.error(
        "Stats Error:",
        error.message
      );

    }

  }



  const card = {
    flex: "1 1 220px",
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,.1)",
    textAlign: "center",
  };



  return (

    <div
      style={{
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        marginBottom: 25,
      }}
    >

      <div style={card}>
        <h3>📋 Total Bookings</h3>
        <h1>{stats.totalBookings}</h1>
      </div>

      <div style={card}>
        <h3>⏳ Pending</h3>
        <h1>{stats.pending}</h1>
      </div>

      <div style={card}>
        <h3>✅ Completed</h3>
        <h1>{stats.completed}</h1>
      </div>

      <div style={card}>
        <h3>👨‍🌾 Customers</h3>
        <h1>{stats.customers}</h1>
      </div>

      <div style={card}>
        <h3>🚜 Drivers</h3>
        <h1>{stats.drivers}</h1>
      </div>

      <div style={card}>
        <h3>💰 Revenue</h3>
        <h1>₹{stats.revenue}</h1>
      </div>

    </div>

  );
}
