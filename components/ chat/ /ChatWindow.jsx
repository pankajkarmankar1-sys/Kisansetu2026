import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import MessageInput from "./MessageInput";

import { supabase } from "../../lib/supabase";

export default function ChatWindow({ bookingId, user }) {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // LOAD OLD MESSAGES
  // -------------------------
  async function loadMessages() {

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);

    setLoading(false);
  }

  // -------------------------
  // SEND MESSAGE
  // -------------------------
  async function sendMessage(text) {

    if (!text) return;

    const newMsg = {
      booking_id: bookingId,
      sender: user?.role || "customer",
      sender_id: user?.id,
      text,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("messages")
      .insert([newMsg]);

    if (error) console.log(error);

  }

  // -------------------------
  // REALTIME LISTENER
  // -------------------------
  useEffect(() => {

    loadMessages();

    const channel = supabase
      .channel("chat-" + bookingId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {

          const newMsg = payload.new;

          setMessages((prev) => [...prev, newMsg]);

        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [bookingId]);

  // -------------------------
  // UI
  // -------------------------
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 15,
        background: "#fff",
      }}
    >

      <h2>💬 Live Chat</h2>

      {loading ? (
        <p>Loading chat...</p>
      ) : (
        <ChatList messages={messages} />
      )}

      <MessageInput onSend={sendMessage} />

    </div>
  );
}
