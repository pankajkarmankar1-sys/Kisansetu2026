import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import DriverDashboard from "../../components/driver/DriverDashboard";



export default function DriverPage(){


  const router = useRouter();


  const [user,setUser] = useState(null);

  const [loading,setLoading] = useState(true);







  useEffect(()=>{

    checkDriver();

  },[]);








  async function checkDriver(){


    try{


      const {

        data:{
          user

        }

      } = await supabase.auth.getUser();







      if(!user){


        router.replace(
          "/driver/login"
        );


        return;


      }







      const {

        data:profile

      } = await supabase

      .from("profiles")

      .select("*")

      .eq(

        "auth_user_id",

        user.id

      )

      .maybeSingle();








      if(!profile || profile.role !== "driver"){


        alert(
          "Driver access denied"
        );


        router.replace("/");


        return;


      }







      setUser({

        ...profile,

        id:user.id

      });






    }
    catch(err){


      console.log(err);


      router.replace("/");


    }
    finally{


      setLoading(false);


    }


  }









  async function logout(){


    await supabase.auth.signOut();


    router.replace("/");


  }








  if(loading){


    return (

      <h2>
        Loading...
      </h2>

    );


  }








  return (

    <DriverDashboard

      user={user}

      logout={logout}

    />

  );


}
