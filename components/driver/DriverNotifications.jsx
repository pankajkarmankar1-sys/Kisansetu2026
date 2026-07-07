import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  requestNotificationPermission,
  showNotification,
} from "../../lib/NotificationService";


export default function DriverNotifications({ driver }) {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!driver?.id) return;

    requestNotificationPermission();

    loadNotifications();


    const channel = supabase
      .channel(`driver_notifications_${driver.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter:
            `user_id=eq.${driver.id}`,
        },
        (payload) => {


          setNotifications((prev) => [
            payload.new,
            ...prev,
          ]);


          showNotification(
            payload.new.title,
            payload.new.message
          );

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


      const { data, error } =
        await supabase
          .from("notifications")
          .select("*")
          .eq(
            "user_id",
            driver.id
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );


      if (error) {
        throw error;
      }


      setNotifications(
        data || []
      );


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
        padding:20,
      }}
    >

      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
        }}
      >

        <h2>
          🔔 Driver Notifications
        </h2>


        <button
          onClick={loadNotifications}
          style={{
            padding:"8px 15px",
            border:"none",
            borderRadius:8,
            background:"#16a34a",
            color:"#fff",
          }}
        >
          🔄 Refresh
        </button>


      </div>




      {loading && (
        <p>
          Loading...
        </p>
      )}




      {!loading &&
        notifications.length === 0 && (

        <p>
          Koi notification nahi hai
        </p>

      )}






      {notifications.map((item)=>(

        <div
          key={item.id}
          style={{
            background:"#fff",
            padding:15,
            marginBottom:12,
            borderRadius:10,
            borderLeft:
              "5px solid #16a34a",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >


          <h3>
            {item.title || "Notification"}
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
