import React from "react";
import AdminSidebar from "./AdminSidebar";
import StatsCards from "./StatsCards";
import BookingList from "./BookingList";
import DriverList from "./DriverList";

export default function AdminDashboard() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6f8",
      }}
    >
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          padding: 20,
          overflowY: "auto",
        }}
      >
        <h1 style={{ marginBottom: 20 }}>
          👨‍💼 Admin Dashboard
        </h1>

        <StatsCards />

        <div style={{ marginTop: 30 }}>
          <BookingList />
        </div>

        <div style={{ marginTop: 30 }}>
          <DriverList />
        </div>
      </div>
    </div>
  );
}
