import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ChatWindow from "./ChatWindow";

export default function AdminChatPanel({ admin }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  // -----------------------------
  // Load ALL chat rooms
  // -----------------------------
  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setRooms(data || []);
  }

  return (
    <div style={styles.container}>
      {/* LEFT: ALL ROOMS */}
      <div style={styles.sidebar}>
        <h3>🛠 Admin Chat Panel</h3>

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setActiveRoom(room)}
            style={{
              ...styles.room,
              background:
                activeRoom?.id === room.id ? "#fff3e0" : "#fff",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              🚜 Driver: {room.driver_id}
            </div>

            <div style={{ fontSize: 12 }}>
              👨‍🌾 Customer: {room.customer_name}
            </div>

            <div style={{ fontSize: 11, opacity: 0.6 }}>
              Booking: {room.booking_id}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: CHAT VIEW */}
      <div style={styles.chatArea}>
        {activeRoom ? (
          <ChatWindow roomId={activeRoom.id} user={admin} />
        ) : (
          <div style={styles.empty}>
            Select a chat to monitor 🛠
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif",
  },

  sidebar: {
    width: "35%",
    borderRight: "1px solid #ddd",
    padding: 10,
    overflowY: "auto",
    background: "#f9f9f9",
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
