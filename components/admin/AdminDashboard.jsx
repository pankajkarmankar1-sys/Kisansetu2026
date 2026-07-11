import React from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

import AdminSidebar from "./AdminSidebar";
import StatsCard from "./StatsCard";
import BookingList from "./BookingList";
import DriverList from "./DriverList";
import FarmerDocuments from "./FarmerDocuments";

export default function AdminDashboard() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    localStorage.clear();
    router.replace("/");
  }

  const isMobile =
    typeof window !== "undefined" &&
    window.innerWidth < 768;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        background: "#f4f6f8",
        width: "100%",
      }}
    >
      <AdminSidebar onLogout={logout} />

      <div
        style={{
          flex: 1,
          width: "100%",
          padding: 15,
          overflowX: "auto",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            marginBottom: 20,
            fontSize: isMobile ? 24 : 32,
          }}
        >
          👨‍💼 Admin Dashboard
        </h1>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <StatsCard />
        </div>

        <div
          style={{
            marginTop: 25,
            width: "100%",
            overflowX: "auto",
          }}
        >
          <BookingList />
        </div>

        <div
          style={{
            marginTop: 25,
            width: "100%",
            overflowX: "auto",
          }}
        >
          <DriverList />
        </div>

        <div
          style={{
            marginTop: 25,
            width: "100%",
            overflowX: "auto",
          }}
        >
          <FarmerDocuments />
        </div>
      </div>
    </div>
  );
}
