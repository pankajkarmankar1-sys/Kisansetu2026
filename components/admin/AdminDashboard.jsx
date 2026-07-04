import React from "react";
import AdminSidebar from "./AdminSidebar";
import StatsCards from "./StatsCards";
import BookingList from "./BookingList";
import DriverList from "./DriverList";

export default function AdminDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <StatsCards />
        <BookingList />
        <DriverList />
      </div>
    </div>
  );
}
