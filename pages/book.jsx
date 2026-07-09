import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import BookService from "../components/customer/BookService";
import { supabase } from "../lib/supabase";


export default function BookPage() {

  const router = useRouter();

  const [user,setUser] = useState(null);

  const [selKhet,setSelKhet] = useState(null);





  useEffect(()=>{

    loadUser();

  },[]);





  async function loadUser(){

    const {
      data:{
        user
      }

    } = await supabase.auth.getUser();



    if(!user){

      router.replace("/");

      return;

    }


    setUser(user);


    const savedFarm =
      localStorage.getItem("selectedFarm");


    if(savedFarm){

      setSelKhet(
        JSON.parse(savedFarm)
      );

    }


  }







  if(!user){

    return <div>Loading...</div>;

  }






  return (

    <BookService

      user={user}

      selKhet={selKhet}

      setSelKhet={setSelKhet}


      onNext={()=>
        router.push("/dashboard")
      }


      back={()=>
        router.back()
      }

    />

  );

}
