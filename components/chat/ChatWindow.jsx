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

  // ---------------- FILE UPLOAD ----------------
  async function uploadFile(file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("chat-files")
      .upload(fileName, file);

    if (error) {
      console.log(error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("chat-files")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function sendFile(file) {
    const url = await uploadFile(file);
    if (!url) return;

    const msg = {
      room_id: roomId,
      sender_id: user.id,
      sender_name: user.name || "User",
      message: "",
      file_url: url,
      file_type: file.type,
      is_read: false,
      created_at: new Date().toISOString(),
    };

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
              {/* TEXT */}
              {m.message && <div>{m.message}</div>}

              {/* FILE */}
              {m.file_url && (
                <div style={{ marginTop: 5 }}>
                  {m.file_type?.includes("image") ? (
                    <img
                      src={m.file_url}
                      alt="file"
                      style={{
                        width: 150,
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <a href={m.file_url} target="_blank">
                      📎 File
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputBox}>
        {/* FILE INPUT */}
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files[0]) {
              sendFile(e.target.files[0]);
            }
          }}
        />

        <button
          onClick={() =>
            document.getElementById("fileUpload").click()
          }
          style={styles.fileBtn}
        >
          📎
        </button>

        {/* TEXT INPUT */}
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
  },

  inputBox: {
    display: "flex",
    padding: 8,
    background: "#fff",
    borderTop: "1px solid #ccc",
    alignItems: "center",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ccc",
    outline: "none",
    marginLeft: 5,
  },

  button: {
    marginLeft: 8,
    padding: "10px 16px",
    border: "none",
    borderRadius: 20,
    background: "#128C7E",
    color: "#fff",
  },

  fileBtn: {
    padding: "8px 12px",
    borderRadius: 20,
    border: "none",
    background: "#eee",
    cursor: "pointer",
  },
};
