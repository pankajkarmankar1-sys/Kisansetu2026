import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ChatWindow from "./ChatWindow";

export default function CustomerChat({ user }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    loadRooms();
  }, [user]);

  async function loadRooms() {
    const { data } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("customer_id", user.id);

    const roomsWithUnread = await Promise.all(
      (data || []).map(async (room) => {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("room_id", room.id)
          .eq("is_read", false)
          .neq("sender_id", user.id);

        return { ...room, unread: count || 0 };
      })
    );

    setRooms(roomsWithUnread);
  }

  return (
    <div style={styles.container}>
      {/* LEFT SIDE */}
      <div style={styles.sidebar}>
        <h3>👨‍🌾 My Chats</h3>

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setActiveRoom(room)}
            style={{
              ...styles.room,
              background:
                activeRoom?.id === room.id ? "#e3f2fd" : "#fff",
              position: "relative",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              🚜 Driver: {room.driver_id}
            </div>

            <div style={{ fontSize: 12 }}>
              Booking: {room.booking_id}
            </div>

            {room.unread > 0 && (
              <span style={styles.badge}>
                {room.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        {activeRoom ? (
          <ChatWindow roomId={activeRoom.id} user={user} />
        ) : (
          <div style={styles.empty}>
            Select chat 💬
          </div>
        )}
      </div>
    </div>
  );
}

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
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
  },

  badge: {
    position: "absolute",
    right: 10,
    top: 10,
    background: "red",
    color: "#fff",
    width: 20,
    height: 20,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
  },
};
