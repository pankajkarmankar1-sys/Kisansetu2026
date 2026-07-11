import React, { useEffect, useState } from "react";
import { getNotifications } from "../../lib/NotificationService";

export default function NotificationPanel({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getNotifications(user.id);

      setNotifications(data || []);
    } catch (error) {
      console.error(
        "Notification Load Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();

    const timer = setInterval(
      loadNotifications,
      5000
    );

    return () => {
      clearInterval(timer);
    };
  }, [user]);

  return (
    <div
      style={{
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>🔔 Notifications</h2>

      {loading && (
        <p>Loading...</p>
      )}

      {!loading &&
        notifications.length === 0 && (
          <p>No Notifications</p>
        )}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
            background: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          <h3>
            {n.title || "Notification"}
          </h3>

          <p>{n.message}</p>

          <small>
            {n.created_at
              ? new Date(
                  n.created_at
                ).toLocaleString()
              : ""}
          </small>
        </div>
      ))}
    </div>
  );
}
