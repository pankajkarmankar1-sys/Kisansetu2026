import { useEffect, useState } from "react";
import { getNotifications } from "../lib/notification";

export default function NotificationBell({ onClick }) {
  const [count, setCount] = useState(0);

  async function load() {
    try {
      const data = await getNotifications();
      setCount(data.length);
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
    <button
      onClick={onClick}
      style={{
        position: "relative",
        fontSize: 22,
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      🔔

      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            background: "red",
            color: "#fff",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: 10,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
