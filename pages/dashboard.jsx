import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Dashboard from "../components/customer/Dashboard";
import AddFarm from "../components/customer/AddFarm";

import { supabase } from "../lib/supabase";


export default function DashboardPage() {

  const router = useRouter();

  const [user,setUser] = useState(null);
  const [farms,setFarms] = useState([]);
  const [loading,setLoading] = useState(true);
  const [showAddFarm,setShowAddFarm] = useState(false);



  useEffect(()=>{

    loadUser();

  },[]);



  async function loadUser(){

    try{

      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();



      if(!user){

        router.replace("/login");
        return;

      }



      const { data: profile } = await supabase
      .from("profiles")
      .select(`
        role,
        name,
        phone,
        document_status,
        aadhaar_front,
        aadhaar_back,
        satbara_7_12
      `)
      .eq(
        "auth_user_id",
        user.id
      )
      .maybeSingle();





      if(profile?.role === "admin"){

        router.replace("/admin");
        return;

      }


      if(profile?.role === "driver"){

        router.replace("/driver");
        return;

      }





      const { data: subscription } = await supabase
      .from("subscriptions")
      .select(`
        status,
        acres,
        amount,
        start_date
      `)
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "status",
        "active"
      )
      .maybeSingle();





      const { data:farmData } = await supabase
      .from("khets")
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      );



      setFarms(
        farmData || []
      );





      setUser({

        id:user.id,


        role:
        profile?.role ||
        "farmer",



        name:
        profile?.name ||
        "Kisan",



        phone:
        profile?.phone ||
        user.phone,



        document_status:
        profile?.document_status ||
        "pending",



        aadhaar_front:
        profile?.aadhaar_front ||
        null,



        aadhaar_back:
        profile?.aadhaar_back ||
        null,



        satbara_7_12:
        profile?.satbara_7_12 ||
        null,



        subscription_status:
        subscription
        ?
        "active"
        :
        "inactive",



        subscription_amount:
        subscription?.amount || 0


      });



    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  }






  async function logout(){

    await supabase.auth.signOut();

    router.replace("/login");

  }





  if(loading){

    return(

      <div
      style={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#F4F7F6",
        fontSize:"24px",
        fontWeight:"bold",
        color:"#2E7D32"
      }}
      >

        🌾 KisanSetu Loading...

      </div>

    );

  }







  if(showAddFarm){

    return(

      <AddFarm

      onSaved={()=>{

        setShowAddFarm(false);

        loadUser();

      }}


      back={()=>{

        setShowAddFarm(false);

      }}

      />

    );

  }







  return(

    <Dashboard

    user={user}

    farms={farms}


    subscriptionStatus={
      user?.subscription_status
    }


    documentStatus={
      user?.document_status
    }


    subscriptionAmount={
      user?.subscription_amount
    }


    onAdmin={()=>{
      router.push("/admin");
    }}



    onDriver={()=>{
      router.push("/driver");
    }}



    onAddFarm={()=>{

      setShowAddFarm(true);

    }}



    onBook={()=>{


      if(user?.document_status !== "approved"){

        alert(
          "Documents approval ke baad booking open hogi"
        );

        return;

      }


      router.push("/book");


    }}



    onSubscription={()=>{

      router.push("/subscription");

    }}



    onBookings={()=>{

      router.push("/bookings");

    }}



    onProfile={()=>{

      router.push("/profile");

    }}



    onNotifications={()=>{

      router.push("/notifications");

    }}



    onLogout={logout}


    />

  );


}
