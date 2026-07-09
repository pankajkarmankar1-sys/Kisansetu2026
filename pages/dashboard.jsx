import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "../components/customer/Dashboard";
import { supabase } from "../lib/supabase";

export default function DashboardPage() {

  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    loadUser();

  }, []);



  async function loadUser() {

    try {

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
        data:profile
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();



      setUser({

        id:user.id,

        name:
          profile?.name ||
          "Kisan",

        phone:
          profile?.phone ||
          user.phone,

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

    return <h2>Loading...</h2>;

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
        router.push("/profile")
      }

      onNotifications={()=>
        router.push("/notifications")
      }

      onLogout={logout}

    />

  );

}
