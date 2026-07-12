import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function FarmSelection({
  user,
  selKhet,
  setSelKhet,
  next,
  back,
}) {


  const [farms,setFarms] = useState([]);

  const [documents,setDocuments] = useState([]);

  const [loading,setLoading] = useState(true);

  const [totalAcres,setTotalAcres] = useState(0);

  const [villageStats,setVillageStats] = useState([]);





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







      const {

        data:farmData,

        error:farmError

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






      if(farmError)

        throw farmError;







      const {

        data:docData,

        error:docError

      } = await supabase


      .from("khet_documents")

      .select("*")

      .eq(

        "user_id",

        authUser.id

      );







      if(docError)

        throw docError;







      setFarms(
        farmData || []
      );


      setDocuments(
        docData || []
      );



      calculateStats(
        farmData || []
      );



    }

    catch(err){

      console.log(err);

    }

    finally{

      setLoading(false);

    }


  }







  function calculateStats(data){


    let acres = 0;

    let village={};




    data.forEach((farm)=>{


      acres += Number(
        farm.acres || 0
      );



      let name =
      farm.village || "Unknown";



      if(!village[name]){


        village[name]={

          village:name,

          farms:0,

          acres:0

        };


      }




      village[name]. farms +=1;


      village[name].acres += Number(
        farm.acres || 0
      );



    });




    setTotalAcres(acres);


    setVillageStats(
      Object.values(village)
    );


  }







  if(loading){


    return (

      <div className="p-10 text-center">

        🌾 Loading Farms...

      </div>

    );


  }







  return (

    <div className="min-h-screen bg-green-50 p-4">



      <div className="bg-green-600 text-white rounded-3xl p-6">


        <h2 className="text-3xl font-bold">

          🌾 Mera Khet

        </h2>


        <p>

          Select Farm For Booking

        </p>


      </div>







      <div className="grid grid-cols-3 gap-3 mt-5">



        <div className="bg-white p-4 rounded-xl">

          🌱 Farms

          <h2 className="font-bold text-xl">

            {farms.length}

          </h2>

        </div>



        <div className="bg-white p-4 rounded-xl">

          📏 Acres

          <h2 className="font-bold text-xl">

            {totalAcres}

          </h2>

        </div>



        <div className="bg-white p-4 rounded-xl">

          📄 7/12

          <h2 className="font-bold text-xl">

            {documents.length}

          </h2>

        </div>


      </div>







      <div className="bg-white mt-5 p-5 rounded-2xl">


        <h3 className="font-bold text-lg">

          📍 Village Wise Stats

        </h3>



        {
          villageStats.map((v,i)=>(

            <p key={i} className="border-b py-2">

              🌾 {v.village}

              {" - "}

              {v.farms} Farm

              {" | "}

              {v.acres} Acre

            </p>

          ))
        }


      </div>








      <h2 className="text-xl font-bold mt-6 mb-3">

        🌾 Your Farms

      </h2>






      {
        farms.map((farm)=>(


          <div

            key={farm.id}

            className="bg-white p-5 rounded-2xl shadow mb-4"

          >



            <h3 className="text-xl font-bold text-green-700">

              🌱 {farm.name}

            </h3>




            <p>

              📍 Village: {farm.village}

            </p>


            <p>

              📏 Acre: {farm.acres}

            </p>


            <p>

              🏙 District: {farm.district}

            </p>



            <p>

              📌 Taluka: {farm.taluka}

            </p>






            <p>

              📄 7/12:

              {

                documents.filter(

                  d=>d.khet_id===farm.id

                ).length

              }

              Files

            </p>







            <button

              onClick={()=>{


                setSelKhet(farm);


                localStorage.setItem(

                  "selectedFarm",

                  JSON.stringify(farm)

                );


                next();


              }}


              className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl"

            >

              ✅ Select This Farm

            </button>





          </div>


        ))
      }







      <button

        onClick={back}

        className="w-full bg-gray-200 py-3 rounded-xl"

      >

        ← Back

      </button>



    </div>

  );


}
