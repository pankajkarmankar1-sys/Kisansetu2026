import React from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

import AdminSidebar from "./AdminSidebar";
import StatsCards from "./StatsCards";
import BookingList from "./BookingList";
import DriverList from "./DriverList";
import FarmerDocuments from "./FarmerDocuments";


export default function AdminDashboard() {


  const router = useRouter();



  async function logout(){

    await supabase.auth.signOut();

    localStorage.clear();

    router.replace("/");

  }




  return (

    <div
      style={{
        display:"flex",
        minHeight:"100vh",
        background:"#f4f6f8",
      }}
    >



      <AdminSidebar

        onLogout={logout}

      />





      <div

        style={{

          flex:1,

          padding:20,

          overflowY:"auto",

        }}

      >




        <h1

          style={{

            marginBottom:20,

          }}

        >

          👨‍💼 Admin Dashboard

        </h1>






        <StatsCards />







        <div

          style={{

            marginTop:30,

          }}

        >

          <BookingList />

        </div>







        <div

          style={{

            marginTop:30,

          }}

        >

          <DriverList />

        </div>








        <div

          style={{

            marginTop:30,

          }}

        >

          <FarmerDocuments />

        </div>






      </div>



    </div>

  );

}
