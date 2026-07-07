import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomerNotifications from "../components/customer/CustomerNotifications";
import { supabase } from "../lib/supabase";

export default function NotificationsPage(){

  const router = useRouter();

  const [user,setUser] = useState(null);


  useEffect(()=>{

    loadUser();

  },[]);



  async function loadUser(){

    const {
      data:{
        user:authUser
      }
    } = await supabase.auth.getUser();


    if(!authUser){

      router.replace("/");
      return;

    }


    const {data}=await supabase
      .from("profiles")
      .select("*")
      .eq(
        "id",
        authUser.id
      )
      .single();


    setUser(
      data || {
        id:authUser.id,
        name:"User"
      }
    );

  }





  return(

    <div
      style={{
        padding:20,
        background:"#f5f7fb",
        minHeight:"100vh",
      }}
    >

      <button
        onClick={()=>router.back()}
        style={{
          padding:10,
          marginBottom:20,
        }}
      >
        ← Back
      </button>


      {
        user &&
        <CustomerNotifications user={user}/>
      }


    </div>

  );

}
