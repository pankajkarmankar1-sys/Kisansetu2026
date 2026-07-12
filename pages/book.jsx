import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import BookService from "../components/customer/BookService";


export default function BookPage(){


  const router = useRouter();


  const [user,setUser] = useState(null);

  const [selKhet,setSelKhet] = useState(null);

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




      setUser(authUser);







      const {

        data:profile,

        error

      } = await supabase

      .from("profiles")

      .select(`

        document_status,

        role

      `)

      .eq(

        "auth_user_id",

        authUser.id

      )

      .maybeSingle();






      if(error)
        throw error;







      if(

        !profile ||

        profile.document_status !== "approved"

      ){

        router.replace("/documents");

        return;

      }







      const savedFarm =

      localStorage.getItem(
        "selectedFarm"
      );






      if(savedFarm){


        setSelKhet(

          JSON.parse(savedFarm)

        );


      }




    }

    catch(err){

      console.log(err.message);

      router.replace("/");


    }

    finally{

      setLoading(false);

    }


  }








  function handleNext(){


    router.push(
      "/dashboard"
    );


  }







  if(loading){


    return (

      <div style={{padding:20}}>

        Loading Booking...

      </div>

    );

  }






  return (

    <BookService

      user={user}

      selKhet={selKhet}

      setSelKhet={setSelKhet}


      onNext={handleNext}


      back={()=>router.back()}


    />

  );


}
