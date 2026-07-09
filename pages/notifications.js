import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NotificationPanel from "../components/common/NotificationPanel";
import { supabase } from "../lib/supabase";


export default function NotificationsPage() {

  const router = useRouter();

  const [user, setUser] = useState(null);


  useEffect(() => {

    loadUser();

  }, []);



  async function loadUser() {


    const {
      data:{
        user:authUser
      }
    } = await supabase.auth.getUser();



    if(!authUser){

      router.replace("/");

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



    setUser(

      profile ||

      {

        id: authUser.id,

        auth_user_id: authUser.id,

        name:"User"

      }

    );


  }





  return (

    <div

      style={{

        padding:20,

        background:"#f5f7fb",

        minHeight:"100vh",

      }}

    >


      <button

        onClick={() => router.back()}

        style={{

          padding:10,

          marginBottom:20,

        }}

      >

        ← Back

      </button>




      {
        user && (

          <NotificationPanel

            user={user}

          />

        )
      }



    </div>

  );

}
