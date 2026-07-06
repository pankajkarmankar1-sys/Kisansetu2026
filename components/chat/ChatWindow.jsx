import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ChatWindow({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

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

  async function sendMessage() {
    if (!text.trim()) return;

    const msg = {
      room_id: roomId,
      sender_id: user.id,
      sender_name: user.name || "User",
      message: text,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setText("");

    await supabase.from("messages").insert([msg]);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((m) => {
          const isMe = m.sender_id === user.id;

          return (
            <div
              key={m.id}
              style={{
                ...styles.bubble,
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#DCF8C6" : "#fff",
              }}
            >
              <div>{m.message}</div>

              <div style={styles.meta}>
                {isMe ? (
                  <span>
                    {m.is_read ? "✔✔ Read" : "✔ Sent"}
                  </span>
                ) : (
                  <span style={{ opacity: 0.6 }}>
                    {m.sender_name}
                  </span>
                )}
              </div>
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
    background: "#e5ddd5",
  },

  chatBox: {
    flex: 1,
    padding: 10,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  bubble: {
    maxWidth: "70%",
    padding: "8px 10px",
    borderRadius: 10,
    fontSize: 14,
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },

  meta: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
    textAlign: "right",
  },

  inputBox: {
    display: "flex",
    padding: 8,
    background: "#fff",
    borderTop: "1px solid #ccc",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    marginLeft: 8,
    padding: "10px 16px",
    border: "none",
    borderRadius: 20,
    background: "#128C7E",
    color: "#fff",
  },
};
