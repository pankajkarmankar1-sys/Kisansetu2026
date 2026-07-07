import { supabase } from "./supabase";

export async function requestNotificationPermission() {
  if (typeof window === "undefined") return false;

  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

export function showNotification(title, body) {
  if (typeof window === "undefined") return;

  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/logo192.png",
    tag: "kisansetu",
    requireInteraction: false,
  });
}

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
