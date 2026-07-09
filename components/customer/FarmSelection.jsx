import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function FarmSelection({
  user,
  selKhet,
  setSelKhet,
  next,
  back,
}) {

  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    loadFarm();

  }, []);



  async function loadFarm() {

    try {

      const {
        data:{
          user:authUser
        }
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
        .eq("auth_user_id", authUser.id)
        .single();



      if(error){
        throw error;
      }


      setFarm(data);


    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  }



  if(loading){

    return (
      <h3>
        Loading Farm...
      </h3>
    );

  }



  return (

    <div
      style={{
        padding:20
      }}
    >

      <h2>
        🌾 Select Your Farm
      </h2>



      {
        farm ? (

          <div
            style={{
              background:"#fff",
              padding:15,
              borderRadius:10,
              border:"1px solid #ddd"
            }}
          >

            <h3>
              {farm.name || "My Farm"}
            </h3>


            <p>
              📍 Village: {farm.village || "-"}
            </p>


            <p>
              🌾 Acres: {farm.acres || 0}
            </p>


            <p>
              🏡 Address: {farm.farm_address || "-"}
            </p>



            <button

              onClick={()=>{

                setSelKhet(farm);

                next();

              }}

              style={{
                width:"100%",
                padding:14,
                background:"#16a34a",
                color:"#fff",
                border:"none",
                borderRadius:10
              }}

            >

              ✅ Select This Farm

            </button>


          </div>

        ) : (

          <p>
            No farm profile found
          </p>

        )

      }



      <button
        onClick={back}
        style={{
          marginTop:15,
          padding:10
        }}
      >
        ← Back
      </button>


    </div>

  );

}
