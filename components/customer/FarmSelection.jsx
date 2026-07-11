import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function FarmSelection({
  user,
  selKhet,
  setSelKhet,
  next,
  back,
}) {

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadFarms();
  }, []);



  async function loadFarms() {

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
      .from("khets")
      .select("*")
      .eq(
        "user_id",
        authUser.id
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      );


      if(error){
        throw error;
      }


      setFarms(data || []);


    }
    catch(err){

      console.log(err.message);

    }
    finally{

      setLoading(false);

    }

  }



  if(loading){

    return <h3>Loading Farms...</h3>;

  }



  return (

    <div style={{padding:20}}>

      <h2>
        🌾 Select Your Farm
      </h2>


      {
        farms.length === 0 && (

          <p>
            No farm added. Please add your farm first.
          </p>

        )
      }



      {
        farms.map((farm)=>(

          <div

            key={farm.id}

            style={{
              background:"#fff",
              padding:15,
              marginBottom:15,
              borderRadius:12,
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

        ))

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
