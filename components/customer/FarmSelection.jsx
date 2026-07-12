import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function FarmSelection({
  user,
  selKhet,
  setSelKhet,
  next,
  addFarm,
  back,
}) {


  const [farms,setFarms] = useState([]);
  const [documents,setDocuments] = useState([]);
  const [loading,setLoading] = useState(true);



  useEffect(()=>{
    loadFarms();
  },[]);




  async function loadFarms(){

    try{

      const {
        data:{
          user:authUser
        }
      } = await supabase.auth.getUser();



      if(!authUser)
        return;



      const {data:farmData,error:farmError}=

      await supabase

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



      if(farmError)
        throw farmError;



      setFarms(
        farmData || []
      );




      const {data:docData}=

      await supabase

      .from("khet_documents")

      .select("*")

      .eq(
        "user_id",
        authUser.id
      );



      setDocuments(
        docData || []
      );


    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  }






  if(loading){

    return(
      <div className="p-5">
        🌾 Loading Farms...
      </div>
    );

  }





  return(

    <div className="min-h-screen bg-green-50 p-4">


      <h2 className="text-3xl font-bold text-green-700 mb-5">

        🌾 Mera Khet

      </h2>




      <button

        onClick={addFarm}

        className="w-full bg-green-600 text-white p-4 rounded-xl mb-5"

      >

        ➕ Add Another 7/12

      </button>






      {
        farms.length===0 &&

        <div className="bg-white p-5 rounded-xl">

          No Farm Added

        </div>

      }






      {
        farms.map((farm)=>(


          <div

            key={farm.id}

            className="bg-white p-5 rounded-xl mb-4 shadow"

          >


            <h3 className="text-xl font-bold text-green-700">

              🌾 {farm.name}

            </h3>



            <p>
              📍 Village: {farm.village}
            </p>


            <p>
              📌 District: {farm.district}
            </p>


            <p>
              🌱 Acres: {farm.acres}
            </p>




            <p>

              📄 Documents:

              {
                documents.filter(
                  d=>d.khet_id===farm.id
                ).length
              }

            </p>





            <button

              onClick={()=>{

                setSelKhet(farm);

                next();

              }}

              className="w-full mt-4 bg-green-600 text-white p-3 rounded-xl"

            >

              ✅ Select This Farm

            </button>



          </div>


        ))

      }





      <button

        onClick={back}

        className="w-full bg-gray-300 p-3 rounded-xl"

      >

        ← Back

      </button>



    </div>

  );


}
