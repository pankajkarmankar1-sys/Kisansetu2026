import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Profile from "../components/customer/Profile";


export default function ProfilePage(){

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
          user:authUser
        }
      } = await supabase.auth.getUser();



      if(!authUser){

        router.replace("/login");
        return;

      }



      const {
        data:profile
      } = await supabase
      .from("profiles")
      .select("*")
      .eq(
        "auth_user_id",
        authUser.id
      )
      .maybeSingle();



      setUser({

        id:authUser.id,

        name:
          profile?.name || "Kisan",

        phone:
          profile?.phone || authUser.phone,

        village:
          profile?.village || "",

        district:
          profile?.district || "",

        taluka:
          profile?.taluka || "",

        state:
          profile?.state || "",

        farm_address:
          profile?.farm_address || "",

        acres:
          profile?.acres || 0,

        document_status:
          profile?.document_status || "pending",

      });


    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  }



  if(loading){

    return <h2>Loading...</h2>;

  }



  return (

    <Profile

      user={user}

      back={()=>router.back()}

    />

  );

}
