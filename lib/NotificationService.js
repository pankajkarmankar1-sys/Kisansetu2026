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

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/logo192.png",
    });
  }
}

export async function getNotifications() {
  // Temporary function to prevent build errors.
  // Replace this later with Supabase notification fetching.
  return [];
}
