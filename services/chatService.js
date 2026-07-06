import { supabase } from "../lib/supabase";

// Send Message
export async function sendMessage(data) {
  const { error } = await supabase
    .from("chats")
    .insert([data]);

  if (error) throw error;
}

// Get Messages
export async function getMessages(bookingId) {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data || [];
}

// Realtime Messages
export function subscribeMessages(bookingId, callback) {
  return supabase
    .channel(`chat-${bookingId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chats",
        filter: `booking_id=eq.${bookingId}`,
      },
      callback
    )
    .subscribe();
}
