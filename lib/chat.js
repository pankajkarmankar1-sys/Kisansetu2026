import { supabase } from "./supabase";

/* Send Message */

export async function sendMessage(data) {

  const { error } = await supabase
    .from("messages")
    .insert([data]);

  if (error) throw error;

}

/* Get Booking Messages */

export async function getMessages(bookingId) {

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;

}

/* Realtime */

export function subscribeMessages(
  bookingId,
  callback
) {

  return supabase
    .channel("messages-" + bookingId)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `booking_id=eq.${bookingId}`,
      },
      callback
    )
    .subscribe();

}
