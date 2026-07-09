import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import AdminDashboard from "../../components/admin/AdminDashboard";
import { supabase } from "../../lib/supabase";


export default function AdminPage() {


  const router = useRouter();


  const [loading,setLoading] = useState(true);

  const [allowed,setAllowed] = useState(false);






  useEffect(()=>{

    checkAdmin();

  },[]);








  async function checkAdmin(){


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







      const {

        data:profile,

        error

      } = await supabase

      .from("profiles")

      .select("role")

      .eq(

        "auth_user_id",

        user.id

      )

      .maybeSingle();







      if(error || !profile){


        console.log(error);


        alert(
          "Profile not found"
        );


        router.replace("/");


        return;


      }







      if(profile.role !== "admin"){


        alert(
          "Access denied"
        );


        router.replace("/");


        return;


      }







      setAllowed(true);





    }

    catch(err){


      console.log(err);


      router.replace("/");


    }

    finally{


      setLoading(false);


    }


  }







  if(loading){


    return (

      <div style={{padding:20}}>

        Checking Admin Access...

      </div>

    );

  }







  if(!allowed){


    return null;


  }







  return (

    <AdminDashboard />

  );


}
