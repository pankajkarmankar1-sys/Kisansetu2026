import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ChatWindow from "./ChatWindow";

export default function CustomerChat({ user }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  // -----------------------------
  // Load Customer Rooms
  // -----------------------------
  useEffect(() => {
    if (!user?.id) return;
    loadRooms();
  }, [user]);

  async function loadRooms() {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setRooms(data || []);
  }

  return (
    <div style={styles.container}>
      {/* LEFT: Rooms List */}
      <div style={styles.sidebar}>
        <h3>👨‍🌾 My Chats</h3>

        {rooms.length === 0 && (
          <p style={{ fontSize: 12, opacity: 0.6 }}>
            No chats yet
          </p>
        )}

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setActiveRoom(room)}
            style={{
              ...styles.room,
              background:
                activeRoom?.id === room.id ? "#e3f2fd" : "#fff",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              🚜 Driver: {room.driver_id}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Booking: {room.booking_id}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: CHAT */}
      <div style={styles.chatArea}>
        {activeRoom ? (
          <ChatWindow roomId={activeRoom.id} user={user} />
        ) : (
          <div style={styles.empty}>
            Select a chat to start 💬
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------
// Styles
// -----------------------------
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif",
  },

  sidebar: {
    width: "30%",
    borderRight: "1px solid #ddd",
    padding: 10,
    overflowY: "auto",
    background: "#fafafa",
  },

  room: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    cursor: "pointer",
    border: "1px solid #eee",
  },

  chatArea: {
    flex: 1,
    padding: 10,
  },

  empty: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#777",
  },
};
