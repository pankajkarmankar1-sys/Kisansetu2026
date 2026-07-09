
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import DriverBookings from "./Driver Bookings";
import DriverProfile from "./Driver Profile";
import DriverEarnings from "./Driver Earnings";
import DriverHistory from "./Driver History";
import DriverNotifications from "./Driver Notifications";


export default function DriverDashboard({user}) {


  const [driver,setDriver] = useState(user || null);

  const [tab,setTab] = useState("bookings");




  useEffect(()=>{

    if(!user){

      loadDriver();

    }

  },[]);





  async function loadDriver(){


    const {

      data:{
        user:authUser

      }

    } = await supabase.auth.getUser();




    if(!authUser)
      return;





    const {

      data,

      error

    } = await supabase

    .from("profiles")

    .select("*")

    .eq(

      "auth_user_id",

      authUser.id

    )

    .maybeSingle();





    if(error){

      console.log(
        "Driver Load Error:",
        error.message
      );

      return;

    }





    setDriver(data);


  }







  return (

    <div

      style={{

        padding:20,

        background:"#f5f5f5",

        minHeight:"100vh"

      }}

    >



      <h1>
        🚜 Driver Dashboard
      </h1>



      <h3>
        Welcome {driver?.name || "Driver"}
      </h3>





      <div

        style={{

          display:"flex",

          flexWrap:"wrap",

          gap:10,

          marginBottom:20

        }}

      >


        <button onClick={()=>setTab("bookings")}>

          📋 Bookings

        </button>



        <button onClick={()=>setTab("notifications")}>

          🔔 Notifications

        </button>



        <button onClick={()=>setTab("earnings")}>

          💰 Earnings

        </button>



        <button onClick={()=>setTab("history")}>

          📜 History

        </button>



        <button onClick={()=>setTab("profile")}>

          👤 Profile

        </button>



      </div>







      {
        tab==="bookings" &&

        <DriverBookings driver={driver}/>

      }





      {
        tab==="notifications" &&

        <DriverNotifications driver={driver}/>

      }





      {
        tab==="earnings" &&

        <DriverEarnings driver={driver}/>

      }





      {
        tab==="history" &&

        <DriverHistory driver={driver}/>

      }





      {
        tab==="profile" &&

        <DriverProfile driver={driver}/>

      }





    </div>

  );

}
