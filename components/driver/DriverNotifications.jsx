import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverNotifications({ driver }) {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (driver?.id) {
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
    }
  }, [driver]);


  async function loadNotifications() {

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", driver.id)
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setNotifications(data || []);
    }
  }


  return (
    <div style={{
      padding:"20px"
    }}>

      <h2>🔔 Driver Notifications</h2>

      {
        notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          notifications.map((n)=>(
            <div
              key={n.id}
              style={{
                background:"#fff",
                padding:"15px",
                marginBottom:"10px",
                borderRadius:"10px",
                boxShadow:"0 2px 8px #ddd"
              }}
            >

              <h4>{n.title}</h4>

              <p>{n.message}</p>

              <small>
                {new Date(n.created_at)
                .toLocaleString()}
              </small>

            </div>
          ))
        )
      }

    </div>
  );
}
