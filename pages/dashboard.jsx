import { useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "../components/customer/Dashboard";

export default function DashboardPage() {
  const router = useRouter();

  const [user] = useState({
    id: "guest",
    name: "Guest User",
  });

  function logout() {
    router.replace("/");
  }

  return (
    <Dashboard
      user={user}
      onBook={() => router.push("/book")}
      onBookings={() => router.push("/bookings")}
      onProfile={() => router.push("/profile")}
      onNotifications={() => router.push("/notifications")}
      onLogout={logout}
    />
  );
}
