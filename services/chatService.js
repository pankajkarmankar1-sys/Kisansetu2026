// services/chatService.js

import { supabase } from "../lib/supabase";


// Send Message
export async function sendMessage(data) {

  if (!data?.booking_id) {
    throw new Error(
      "Booking ID required"
    );
  }


  if (!data?.message) {
    throw new Error(
      "Message required"
    );
  }


  const {
    error
  } = await supabase
    .from("chats")
    .insert([
      {
        ...data,
        created_at:
          new Date().toISOString(),
      }
    ]);


  if (error) {
    throw error;
  }


  return true;

}



// Get Messages
export async function getMessages(
  bookingId
) {

  const {
    data,
    error
  } = await supabase
    .from("chats")
    .select("*")
    .eq(
      "booking_id",
      bookingId
    )
    .order(
      "created_at",
      {
        ascending:true,
      }
    );


  if(error) {
    throw error;
  }


  return data || [];

}



// Realtime Messages
export function subscribeMessages(
  bookingId,
  callback
) {

  if(!bookingId) return null;


  return supabase
    .channel(
      `chat-${bookingId}`
    )
    .on(
      "postgres_changes",
      {
        event:"*",
        schema:"public",
        table:"chats",
        filter:
        `booking_id=eq.${bookingId}`,
      },
      callback
    )
    .subscribe();

}
