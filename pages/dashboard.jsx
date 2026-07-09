import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Dashboard from "../components/customer/Dashboard";
import { supabase } from "../lib/supabase";


export default function DashboardPage() {

  const router = useRouter();

  const [user,setUser] = useState(null);

  const [loading,setLoading] = useState(true);



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

        router.replace("/");

        return;

      }



      const {
        data:profile
      } = await supabase

      .from("profiles")

      .select("*")

      .eq("auth_user_id",user.id)

      .maybeSingle();



      setUser({

        id:user.id,

        phone:user.phone,

        name:
        profile?.name ||
        "Kisan"


      });



    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }


  }





  function logout(){

    supabase.auth.signOut();

    router.replace("/");

  }






  if(loading){

    return <div>Loading...</div>;

  }




  return (

    <Dashboard

      user={user}

      onBook={()=>
        router.push("/book")
      }


      onBookings={()=>
        router.push("/bookings")
      }


      onProfile={()=>
        router.push("/Profile")
      }


      onNotifications={()=>
        router.push("/notifications")
      }


      onLogout={logout}

    />

  );

}
