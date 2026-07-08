import { supabase } from "./supabase";

/* ==========================
   Send Message
========================== */

export async function sendMessage(data) {
  try {
    const { error } = await supabase
      .from("messages")
      .insert([data]);

    if (error) throw error;

    return true;
  } catch (err) {
    console.error(
      "Send Message Error:",
      err.message
    );
    return false;
  }
}

/* ==========================
   Get Booking Messages
========================== */

export async function getMessages(bookingId) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", {
        ascending: true,
      });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error(
      "Get Messages Error:",
      err.message
    );

    return [];
  }
}

/* ==========================
   Realtime Subscription
========================== */

export function subscribeMessages(
  bookingId,
  callback
) {
  return supabase
    .channel(`messages-${bookingId}`)
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

/* ==========================
   Unsubscribe
========================== */

export function unsubscribeMessages(channel) {
  if (channel) {
    supabase.removeChannel(channel);
  }
}
