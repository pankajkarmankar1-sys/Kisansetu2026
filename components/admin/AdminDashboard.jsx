import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

import AdminSidebar from "./AdminSidebar";
import StatsCard from "./StatsCard";
import BookingList from "./BookingList";
import DriverList from "./DriverList";
import FarmerDocuments from "./FarmerDocuments";
import SubscriptionList from "./SubscriptionList";


export default function AdminDashboard() {


  const router = useRouter();

  const [isMobile,setIsMobile] = useState(false);



  useEffect(()=>{


    function checkScreen(){

      setIsMobile(
        window.innerWidth < 768
      );

    }


    checkScreen();


    window.addEventListener(
      "resize",
      checkScreen
    );


    return ()=>{

      window.removeEventListener(
        "resize",
        checkScreen
      );

    };


  },[]);





  async function logout(){

    await supabase.auth.signOut();

    localStorage.clear();

    router.replace("/");

  }





  return (

    <div

      style={{

        display:"flex",

        flexDirection:
        isMobile
        ?
        "column"
        :
        "row",

        minHeight:"100vh",

        background:"#f4f6f8",

        width:"100%",

      }}

    >



      <AdminSidebar

        onLogout={logout}

      />





      <main

        style={{

          flex:1,

          width:"100%",

          padding:15,

          overflowX:"auto",

        }}

      >



        <h1>

          👨‍💼 Admin Dashboard

        </h1>




        <div style={{marginTop:20}}>

          <StatsCard />

        </div>





        <div style={{marginTop:25}}>

          <BookingList />

        </div>





        <div style={{marginTop:25}}>

          <DriverList />

        </div>





        <div style={{marginTop:25}}>

          <FarmerDocuments />

        </div>





        <div style={{marginTop:25}}>

          <SubscriptionList />

        </div>




      </main>



    </div>

  );

}
