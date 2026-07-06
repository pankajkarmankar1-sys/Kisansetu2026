import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ChatWindow({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Load messages + realtime
  useEffect(() => {
    if (!roomId) return;

    loadMessages();

    const channel = supabase
      .channel(`chat-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [roomId]);

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  // SEND MESSAGE
  async function sendMessage() {
    if (!text.trim()) return;

    const msg = {
      room_id: roomId,
      sender_id: user.id,
      sender_name: user.name || "User",
      message: text,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setText("");

    await supabase.from("messages").insert([msg]);
  }

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // MARK AS READ
  useEffect(() => {
    if (!roomId || !user?.id) return;

    markAsRead();
  }, [roomId]);

  async function markAsRead() {
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("room_id", roomId)
      .neq("sender_id", user.id);
  }

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((m) => {
          const isMe = m.sender_id === user.id;

          return (
            <div
              key={m.id}
              style={{
                ...styles.msg,
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#DCF8C6" : "#fff",
              }}
            >
              <div style={styles.name}>{m.sender_name}</div>
              <div>{m.message}</div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    border: "1px solid #ddd",
    borderRadius: 10,
    overflow: "hidden",
    background: "#f5f5f5",
  },

  chatBox: {
    flex: 1,
    padding: 10,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  msg: {
    maxWidth: "70%",
    padding: 8,
    borderRadius: 10,
    fontSize: 14,
  },

  name: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 3,
  },

  inputBox: {
    display: "flex",
    padding: 8,
    borderTop: "1px solid #ddd",
    background: "#fff",
  },

  input: {
    flex: 1,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
    outline: "none",
  },

  button: {
    marginLeft: 8,
    padding: "10px 15px",
    border: "none",
    borderRadius: 8,
    background: "#2e7d32",
    color: "#fff",
  },
};
