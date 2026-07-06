import { useEffect, useState } from "react";
import { getNotifications } from "../lib/notification";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  async function load() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();

    const timer = setInterval(load, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        padding: 15,
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,.1)",
      }}
    >
      <h3>Notifications</h3>

      {notifications.length === 0 && (
        <p>No Notifications</p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "10px 0",
          }}
        >
          <div>{n.message}</div>

          <small>
            {new Date(
              n.sent_at || n.created_at
            ).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
