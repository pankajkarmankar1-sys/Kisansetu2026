import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverNotifications({ driver }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driver?.id) return;

    loadNotifications();

    const channel = supabase
      .channel("driver_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${driver.id}`,
        },
        (payload) => {
          setNotifications((prev) => [
            payload.new,
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driver]);

  async function loadNotifications() {
    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", driver.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Notification Error:", error);
    } else {
      setNotifications(data || []);
    }

    setLoading(false);
  }


  if (!driver?.id) {
    return (
      <div>
        Driver login nahi hai
      </div>
    );
  }


  return (
    <div style={styles.container}>

      <h2 style={styles.title}>
        🔔 Driver Notifications
      </h2>


      {loading && (
        <p>Loading...</p>
      )}


      {!loading && notifications.length === 0 && (
        <p>
          Koi notification nahi hai
        </p>
      )}


      {notifications.map((item) => (
        <div
          key={item.id}
          style={styles.card}
        >

          <h3>
            {item.title}
          </h3>

          <p>
            {item.message}
          </p>

          <small>
            {new Date(item.created_at).toLocaleString()}
          </small>

        </div>
      ))}


    </div>
  );
}



const styles = {

  container: {
    padding: "20px",
  },

  title: {
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

};
