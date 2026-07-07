import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import DriverBookings from "./DriverBookings";
import DriverProfile from "./DriverProfile";
import DriverEarnings from "./DriverEarnings";
import DriverHistory from "./DriverHistory";

export default function DriverDashboard() {
  const [driver, setDriver] = useState(null);
  const [tab, setTab] = useState("bookings");

  useEffect(() => {
    loadDriver();
  }, []);

  async function loadDriver() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setDriver(data);
  }

  return (
    <div
      style={{
        padding: 20,
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1>🚜 Driver Dashboard</h1>

      <h3>
        Welcome {driver?.name || "Driver"}
      </h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <button onClick={() => setTab("bookings")}>📋 Bookings</button>

        <button onClick={() => setTab("earnings")}>💰 Earnings</button>

        <button onClick={() => setTab("history")}>📜 History</button>

        <button onClick={() => setTab("profile")}>👤 Profile</button>
      </div>

      {tab === "bookings" && (
        <DriverBookings driver={driver} />
      )}

      {tab === "earnings" && (
        <DriverEarnings driver={driver} />
      )}

      {tab === "history" && (
        <DriverHistory driver={driver} />
      )}

      {tab === "profile" && (
        <DriverProfile driver={driver} />
      )}
    </div>
  );
}
