import React, { useEffect } from "react";
import { useRouter } from "next/router";
import AdminDashboard from "../../components/admin/AdminDashboard";
import { supabase } from "../../lib/supabase";


export default function AdminPage() {

  const router = useRouter();


  useEffect(()=>{

    checkAdmin();

  },[]);



  async function checkAdmin(){

    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();


    if(!user){

      router.replace("/");

      return;

    }



    // Future role check yaha add karenge

  }




  return (

    <AdminDashboard />

  );

}
