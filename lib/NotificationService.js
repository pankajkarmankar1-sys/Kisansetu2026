
import { supabase } from "./supabase";

/* ==========================
   Notification Permission
========================== */

export async function requestNotificationPermission() {
  if (typeof window === "undefined") return false;

  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

/* ==========================
   Show Browser Notification
========================== */

export function showNotification(title, body) {
  if (typeof window === "undefined") return;

  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  new Notification(
    title || "KisanSetu",
    {
      body: body || "",
      icon: "/logo192.png",
      badge: "/logo192.png",
      tag: "kisansetu",
      requireInteraction: false,
      silent: false,
    }
  );
}

/* ==========================
   Get User Notifications
========================== */

export async function getNotifications(userId) {
  try {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error(
      "Notification Fetch Error:",
      err.message
    );

    return [];
  }
}
