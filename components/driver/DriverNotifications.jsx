import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverNotifications({ driver }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driver?.id) return;

    loadNotifications();

    const channel = supabase
      .channel(`driver_notifications_${driver.id}`)
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
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", driver.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setNotifications(data || []);

    } catch (error) {
      console.log(
        "Notification Error:",
        error.message
      );

    } finally {
      setLoading(false);
    }
  }


  if (!driver?.id) {
    return (
      <div>
        Driver login nahi hai
      </div>
    );
  }


  return (
    <div
      style={{
        padding: 20,
      }}
    >

      <h2>
        🔔 Driver Notifications
      </h2>


      {loading && (
        <p>
          Loading...
        </p>
      )}


      {!loading && notifications.length === 0 && (
        <p>
          Koi notification nahi hai
        </p>
      )}


      {notifications.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 12,
            borderRadius: 10,
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >

          <h3>
            {item.title}
          </h3>

          <p>
            {item.message}
          </p>

          <small>
            {item.created_at &&
              new Date(
                item.created_at
              ).toLocaleString()}
          </small>

        </div>
      ))}

    </div>
  );
}
