import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ChatWindow from "./ChatWindow";

export default function DriverChat({ driver }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  // -----------------------------
  // Load Driver Chat Rooms
  // -----------------------------
  useEffect(() => {
    if (!driver?.id) return;
    loadRooms();
  }, [driver]);

  async function loadRooms() {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("driver_id", driver.id)
      .order("created_at", { ascending: false });

    if (!error) setRooms(data || []);
  }

  return (
    <div style={styles.container}>
      {/* LEFT: Rooms */}
      <div style={styles.sidebar}>
        <h3>🚜 Driver Chats</h3>

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setActiveRoom(room)}
            style={{
              ...styles.room,
              background:
                activeRoom?.id === room.id ? "#dcedc8" : "#fff",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              {room.customer_name}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Booking: {room.booking_id}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Chat */}
      <div style={styles.chatArea}>
        {activeRoom ? (
          <ChatWindow roomId={activeRoom.id} user={driver} />
        ) : (
          <div style={styles.empty}>
            Select a chat to start 🚜
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
