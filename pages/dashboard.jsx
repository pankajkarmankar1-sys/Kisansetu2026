import { useRouter } from "next/router";
import Dashboard from "../components/customer/Dashboard";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <Dashboard
      user={{ name: "Pankaj" }}
      onBook={() => router.push("/book")}
      onBookings={() => router.push("/bookings")}
      onProfile={() => router.push("/profile")}
      onNotifications={() => alert("Notifications")}
      onLogout={() => router.push("/login")}
    />
  );
}
