import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function StatsCards() {

  const [stats,setStats] = useState({
    total:0,
    today:0,
    pending:0,
    completed:0,
    cancelled:0,
    drivers:0,
    customers:0,
    revenue:0,
  });



  useEffect(()=>{

    loadStats();


    const channel =
      supabase
      .channel("stats-update")
      .on(
        "postgres_changes",
        {
          event:"*",
          schema:"public",
          table:"bookings",
        },
        ()=>{
          loadStats();
        }
      )
      .subscribe();



    return ()=>{

      supabase.removeChannel(channel);

    };


  },[]);






  async function loadStats(){

    try{


      const {
        data:bookings
      } = await supabase
        .from("bookings")
        .select("*");




      const {
        count:drivers
      } = await supabase
        .from("profiles")
        .select("*",{
          count:"exact",
          head:true,
        })
        .eq(
          "role",
          "driver"
        );




      const {
        count:customers
      } = await supabase
        .from("profiles")
        .select("*",{
          count:"exact",
          head:true,
        })
        .eq(
          "role",
          "customer"
        );




      const today =
        new Date()
        .toISOString()
        .split("T")[0];



      setStats({

        total:
          bookings?.length || 0,


        today:
          bookings?.filter(
            b =>
            b.created_at?.startsWith(today)
          ).length || 0,


        pending:
          bookings?.filter(
            b=>b.status==="Pending"
          ).length || 0,


        completed:
          bookings?.filter(
            b=>b.status==="Completed"
          ).length || 0,


        cancelled:
          bookings?.filter(
            b=>b.status==="Cancelled"
          ).length || 0,


        drivers:
          drivers || 0,


        customers:
          customers || 0,



        revenue:
          bookings
          ?.filter(
            b=>b.status==="Completed"
          )
          .reduce(
            (sum,b)=>
            sum + Number(b.amount || 0),
            0
          ) || 0,

      });



    }catch(err){

      console.log(
        "Stats Error",
        err.message
      );

    }

  }






  const card={

    flex:"1 1 200px",

    background:"#fff",

    padding:20,

    borderRadius:12,

    boxShadow:
    "0 2px 8px rgba(0,0,0,.1)",

    textAlign:"center",

  };





  return(

    <div>


      <button
        onClick={loadStats}
        style={{
          marginBottom:15,
          padding:10,
          border:"none",
          borderRadius:8,
          background:"#16a34a",
          color:"#fff",
        }}
      >
        🔄 Refresh Stats
      </button>




      <div

        style={{

          display:"flex",

          gap:20,

          flexWrap:"wrap",

          marginBottom:25,

        }}

      >


        <div style={card}>
          📋 Total
          <h1>{stats.total}</h1>
        </div>


        <div style={card}>
          📅 Today
          <h1>{stats.today}</h1>
        </div>


        <div style={card}>
          ⏳ Pending
          <h1>{stats.pending}</h1>
        </div>


        <div style={card}>
          ✅ Completed
          <h1>{stats.completed}</h1>
        </div>


        <div style={card}>
          ❌ Cancelled
          <h1>{stats.cancelled}</h1>
        </div>


        <div style={card}>
          👨‍🌾 Customers
          <h1>{stats.customers}</h1>
        </div>


        <div style={card}>
          🚜 Drivers
          <h1>{stats.drivers}</h1>
        </div>


        <div style={card}>
          💰 Revenue
          <h1>₹{stats.revenue}</h1>
        </div>


      </div>

    </div>

  );

}
