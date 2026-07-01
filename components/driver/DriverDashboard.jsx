import React, { useState } from "react";
import DriverBookings from "./DriverBookings";
import DriverProfile from "./DriverProfile";
import DriverEarnings from "./DriverEarnings";
import DriverHistory from "./DriverHistory";

export default function DriverDashboard({ driver }) {

  const [tab, setTab] = useState("bookings");

  return (
    <div style={{ padding:20 }}>

      <h1>🚜 Driver Dashboard</h1>

      <div style={{ display:"flex", gap:10, marginBottom:20 }}>

        <button onClick={()=>setTab("bookings")}>Bookings</button>

        <button onClick={()=>setTab("earnings")}>Earnings</button>

        <button onClick={()=>setTab("history")}>History</button>

        <button onClick={()=>setTab("profile")}>Profile</button>

      </div>

      {tab==="bookings" && <DriverBookings driver={driver}/>}

      {tab==="earnings" && <DriverEarnings driver={driver}/>}

      {tab==="history" && <DriverHistory driver={driver}/>}

      {tab==="profile" && <DriverProfile driver={driver}/>}

    </div>
  );
}
