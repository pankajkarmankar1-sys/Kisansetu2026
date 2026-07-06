import { supabase } from "./supabase";

// Create chat room when booking is made
export async function createChatRoom({
  booking_id,
  driver_id,
  customer_id,
  customer_name,
}) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .insert([
      {
        booking_id,
        driver_id,
        customer_id,
        customer_name,
      },
    ])
    .select();

  if (error) {
    console.log("Chat room create error:", error.message);
    return null;
  }

  return data?.[0];
}
