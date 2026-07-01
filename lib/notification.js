import { supabase } from "./supabase";

export async function sendNotification(message, sendTo = "all") {
  const { error } = await supabase.from("notifications").insert({
    message,
    send_to: sendTo,
  });

  if (error) throw error;
}

export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("sent_at", { ascending: false });

  if (error) throw error;

  return data || [];
}
