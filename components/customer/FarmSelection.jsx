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
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalAcres, setTotalAcres] = useState(0);
  const [villageStats, setVillageStats] = useState([]);



  useEffect(() => {

    loadFarms();

  }, []);



  async function loadFarms(){

    try{

      setLoading(true);


      const {
        data:{
          user:authUser
        }
      } = await supabase.auth.getUser();



      if(!authUser) return;



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



      setFarms(
        farmData || []
      );



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



      setDocuments(
        docData || []
      );



      calculateStats(
        farmData || []
      );



    }
    catch(error){

      console.log(
        error.message
      );

    }
    finally{

      setLoading(false);

    }

  }



  function calculateStats(data){


    let acres = 0;


    const village = {};



    data.forEach((farm)=>{


      acres += Number(
        farm.acres || 0
      );



      const name =
      farm.village || "Unknown";



      if(!village[name]){

        village[name]={
          village:name,
          farms:0,
          acres:0
        };

      }



      village[name].farms += 1;

      village[name].acres += Number(
        farm.acres || 0
      );


    });



    setTotalAcres(
      acres
    );


    setVillageStats(
      Object.values(village)
    );


  }
  if(loading){

    return (

      <div className="min-h-screen flex items-center justify-center bg-green-50">

        <div className="text-xl font-semibold text-green-700">

          🌾 Loading Farms...

        </div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-green-50 p-4">


      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 text-white shadow-lg mb-5">


        <h2 className="text-2xl font-bold">

          🌾 Mera Khet

        </h2>


        <p className="mt-2">

          Manage your farms & 7/12 documents

        </p>


      </div>



      <div className="grid grid-cols-3 gap-3 mb-5">


        <div className="bg-white rounded-2xl p-4 shadow">

          <p className="text-gray-500 text-sm">
            Farms
          </p>

          <h3 className="text-2xl font-bold text-green-700">

            {farms.length}

          </h3>

        </div>



        <div className="bg-white rounded-2xl p-4 shadow">

          <p className="text-gray-500 text-sm">
            Acres
          </p>

          <h3 className="text-2xl font-bold text-green-700">

            {totalAcres}

          </h3>

        </div>



        <div className="bg-white rounded-2xl p-4 shadow">

          <p className="text-gray-500 text-sm">
            7/12
          </p>

          <h3 className="text-2xl font-bold text-green-700">

            {documents.length}

          </h3>

        </div>


      </div>



      <button

        onClick={()=>next("addFarm")}

        className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow mb-5"

      >

        ➕ Add Another 7/12

      </button>



      <div className="bg-white rounded-2xl p-5 shadow mb-5">


        <h3 className="font-bold text-lg mb-3">

          📍 Village Wise Stats

        </h3>



        {
          villageStats.map((v,index)=>(


            <div

              key={index}

              className="flex justify-between border-b py-3"

            >

              <span>
                🌱 {v.village}
              </span>


              <span className="font-semibold">

                {v.farms} Farm | {v.acres} Acre

              </span>


            </div>


          ))
        }


      </div>
      if(loading){

    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-xl font-bold text-green-700">
          🌾 Loading Farms...
        </div>
      </div>
    );

  }


  return (

    <div className="min-h-screen bg-green-50 p-4">


      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 text-white shadow-lg">

        <h2 className="text-3xl font-bold">
          🌾 Mera Khet
        </h2>

        <p className="mt-2">
          Manage your farms & 7/12 documents
        </p>

      </div>



      <div className="grid grid-cols-3 gap-3 mt-5">


        <div className="bg-white rounded-2xl p-4 shadow">

          <p className="text-gray-500 text-sm">
            🌱 Farms
          </p>

          <h3 className="text-2xl font-bold text-green-700">
            {farms.length}
          </h3>

        </div>



        <div className="bg-white rounded-2xl p-4 shadow">

          <p className="text-gray-500 text-sm">
            📏 Acre
          </p>

          <h3 className="text-2xl font-bold text-green-700">
            {totalAcres}
          </h3>

        </div>



        <div className="bg-white rounded-2xl p-4 shadow">

          <p className="text-gray-500 text-sm">
            📄 7/12
          </p>

          <h3 className="text-2xl font-bold text-green-700">
            {documents.length}
          </h3>

        </div>


      </div>




      <button

        onClick={()=>next("addFarm")}

        className="w-full mt-5 bg-green-600 text-white py-4 rounded-2xl font-bold shadow"

      >

        ➕ Add Another 7/12

      </button>




      <div className="bg-white rounded-2xl p-5 mt-5 shadow">


        <h3 className="font-bold text-lg mb-3">
          📍 Village Wise Stats
        </h3>


        {
          villageStats.map((item,index)=>(

            <div
              key={index}
              className="flex justify-between border-b py-3"
            >

              <span>
                🌾 {item.village}
              </span>


              <span className="font-semibold">

                {item.farms} Farm • {item.acres} Acre

              </span>


            </div>

          ))
        }


      </div>
      <div className="mt-5">

        <h3 className="text-xl font-bold mb-4">
          🌾 Your Farms
        </h3>


        {
          farms.length === 0 && (

            <div className="bg-white rounded-2xl p-5 shadow text-center">

              <p className="text-gray-600">
                No farm added yet
              </p>

              <p className="text-sm mt-2">
                Add your first 7/12 document
              </p>

            </div>

          )
        }



        {
          farms.map((farm)=>(

            <div
              key={farm.id}
              className="bg-white rounded-2xl p-5 shadow mb-4"
            >


              <div className="flex justify-between items-center">


                <h3 className="text-xl font-bold text-green-700">

                  🌾 {farm.name || "My Farm"}

                </h3>


                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                  {farm.acres || 0} Acre

                </span>


              </div>



              <div className="mt-3 space-y-2 text-gray-700">


                <p>
                  📍 Village: {farm.village || "-"}
                </p>


                <p>
                  🏙 District: {farm.district || "-"}
                </p>


                <p>
                  📌 Taluka: {farm.taluka || "-"}
                </p>


                <p>
                  🏡 Address: {farm.farm_address || "-"}
                </p>



              </div>




              <div className="mt-4 bg-green-50 rounded-xl p-3">


                <p className="font-semibold text-green-700">

                  📄 7/12 Documents

                </p>


                <p>

                  {
                    documents.filter(
                      (doc)=>doc.khet_id === farm.id
                    ).length
                  }
                  Uploaded

                </p>


              </div>




              <button

                onClick={()=>{

                  setSelKhet(farm);

                  next();

                }}

                className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold"

              >

                ✅ Select This Farm

              </button>


            </div>


          ))
        }


      </div>




      <button

        onClick={back}

        className="w-full mt-5 bg-gray-200 py-3 rounded-xl font-semibold"

      >

        ← Back

      </button>



    </div>

  );

      }
