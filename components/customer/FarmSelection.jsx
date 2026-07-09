import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function FarmSelection({
  user,
  selKhet,
  setSelKhet,
  next,
}) {

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    loadFarms();

  }, []);



  async function loadFarms(){

    try{

      const {
        data:{user:authUser}
      } = await supabase.auth.getUser();


      if(!authUser){
        return;
      }


      const {
        data,
        error
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", authUser.id);



      if(error)
        throw error;



      setFarms(data || []);


    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  }



  return (

    <div
      style={{
        padding:20
      }}
    >

      <h2>
        🌾 Select Farm
      </h2>


      {
        loading
        ?
        <p>Loading farms...</p>
        :
        farms.map((farm)=>(

          <button

            key={farm.id}

            onClick={()=>{
              setSelKhet(farm);
              next();
            }}

            style={{
              display:"block",
              width:"100%",
              padding:15,
              marginBottom:10,
              borderRadius:10,
            }}

          >

            🌾 {farm.name || "My Farm"}

            <br/>

            {farm.village}

            <br/>

            {farm.acres} Acre

          </button>

        ))

      }


    </div>

  );

}
