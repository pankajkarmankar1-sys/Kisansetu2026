import { supabase } from "./supabase";

// Create chat room when booking is made
export async function createChatRoom({
  booking_id,
  driver_id,
  customer_id,
  customer_name,
}) {
  try {
    // Check if chat room already exists
    const { data: existing } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("booking_id", booking_id)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    const { data, error } = await supabase
      .from("chat_rooms")
      .insert([
        {
          booking_id,
          driver_id,
          customer_id,
          customer_name,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error(
      "Chat Room Error:",
      err.message
    );
    return null;
  }
}
