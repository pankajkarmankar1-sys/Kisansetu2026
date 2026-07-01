import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import MessageInput from "./MessageInput";

import {
  sendMessage,
  getMessages,
  subscribeMessages,
} from "../../lib/chat";

export default function ChatWindow({
  booking,
  user,
  receiver,
}) {

  const [messages, setMessages] = useState([]);

  useEffect(() => {

    if (!booking?.id) return;

    loadMessages();

    const channel = subscribeMessages(
      booking.id,
      () => {
        loadMessages();
      }
    );

    return () => {
      channel.unsubscribe();
    };

  }, [booking]);

  async function loadMessages() {

    try {

      const data = await getMessages(
        booking.id
      );

      setMessages(data || []);

    } catch (err) {

      console.error(err);

    }

  }

  async function handleSend(text) {

    if (!text) return;

    try {

      await sendMessage({

        booking_id: booking.id,

        sender_id: user?.id,

        sender_type: user?.role,

        receiver_id: receiver?.id,

        message: text,

      });

    } catch (err) {

      console.error(err);

    }

  }

  return (

    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        background: "#fff",
        padding: 15,
      }}
    >

      <h2>💬 Chat</h2>

      <ChatList
        messages={messages}
      />

      <MessageInput
        onSend={handleSend}
      />

    </div>

  );

}
