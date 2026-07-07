import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "../components/customer/Dashboard";
import { supabase } from "../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Loading..." });

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      router.replace("/");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (data) {
      setUser(data);
    } else {
      setUser({
        name: authUser.phone || authUser.email || "User",
      });
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <Dashboard
      user={user}
      onBook={() => router.push("/book")}
      onBookings={() => router.push("/bookings")}
      onProfile={() => router.push("/profile")}
      onNotifications={() => alert("Notifications")}
      onLogout={logout}
    />
  );
}
