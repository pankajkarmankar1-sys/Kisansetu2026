import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { getNotifications } from "../../lib/notificationService";

export default function NotificationBell({
  user,
  onClick,
}) {
  const [count, setCount] = useState(0);

  async function loadNotifications() {
    try {
      if (!user?.id) {
        setCount(0);
        return;
      }

      const data = await getNotifications(user.id);
      setCount(data?.length || 0);

    } catch (err) {
      console.error("Notification Error:", err);
    }
  }

  useEffect(() => {

    if (!user?.id) return;

    loadNotifications();

    const channel = supabase
      .channel(`notification-bell-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [user]);

  return (
    <button
      onClick={onClick}
      title="Notifications"
      style={{
        position: "relative",
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "none",
        background: "#16a34a",
        color: "#fff",
        fontSize: 24,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,.2)",
      }}
    >
      🔔

      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 22,
            height: 22,
            borderRadius: "50%",
            background: "#ef4444",
            color: "#fff",
            fontSize: 11,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #fff",
            padding: "0 4px",
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
