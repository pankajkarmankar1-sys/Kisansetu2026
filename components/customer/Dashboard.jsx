import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CustomerNotifications({ user }) {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!user?.id) return;

    loadNotifications();


    const channel = supabase
      .channel(`customer_notifications_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter:
            `user_id=eq.${user.id}`,
        },
        (payload)=>{

          setNotifications((prev)=>[
            payload.new,
            ...prev,
          ]);

        }
      )
      .subscribe();



    return ()=>{
      supabase.removeChannel(channel);
    };


  },[user]);





  async function loadNotifications(){

    try{

      setLoading(true);


      const {data,error}=await supabase
        .from("notifications")
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending:false,
          }
        );


      if(error) throw error;


      setNotifications(
        data || []
      );


    }catch(err){

      console.log(err.message);

    }finally{

      setLoading(false);

    }

  }





  return(

    <div
      style={{
        background:"#fff",
        padding:20,
        borderRadius:12,
      }}
    >

      <h2>
        🔔 Notifications
      </h2>


      <button
        onClick={loadNotifications}
        style={{
          padding:10,
          marginBottom:15,
        }}
      >
        🔄 Refresh
      </button>



      {
        loading &&
        <p>
          Loading...
        </p>
      }



      {
        !loading &&
        notifications.length===0 &&
        <p>
          No Notifications
        </p>
      }




      {
        notifications.map((n)=>(

          <div
            key={n.id}
            style={{
              borderBottom:
                "1px solid #ddd",
              padding:"10px 0",
            }}
          >

            <h3>
              {n.title}
            </h3>

            <p>
              {n.message}
            </p>


            <small>
              {
                new Date(
                  n.created_at
                ).toLocaleString()
              }
            </small>


          </div>

        ))
      }



    </div>

  );

}
