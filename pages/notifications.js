import { useRouter } from "next/router";
import NotificationPanel from "../components/common/NotificationPanel";

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 20,
      }}
    >
      <button
        onClick={() => router.back()}
        style={{
          padding: "10px 16px",
          marginBottom: 20,
          border: "none",
          borderRadius: 8,
          background: "#16a34a",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2 style={{ marginBottom: 20 }}>
        🔔 Notifications
      </h2>

      <NotificationPanel />
    </div>
  );
}
