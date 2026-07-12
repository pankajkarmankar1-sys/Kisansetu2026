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


      setFarms(farmData || []);



      const {
        data:docData
      } = await supabase

      .from("khet_documents")
      .select("*")
      .eq(
        "user_id",
        authUser.id
      );


      setDocuments(docData || []);


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

      <div className="min-h-screen flex items-center justify-center bg-green-50">

        <div className="text-xl font-bold text-green-700">

          🌾 Loading Farms...

        </div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-5">


      <div className="max-w-xl mx-auto">


        <div className="bg-white rounded-3xl shadow-lg p-6">


          <h1 className="text-3xl font-bold text-green-700">

            🌾 Mera Khet

          </h1>


          <p className="text-gray-500 mt-2">

            Service booking ke liye apna farm select kare

          </p>




          <button

            onClick={addFarm}

            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow"

          >

            ➕ Add New Farm / 7-12

          </button>



        </div>





        {
          farms.length===0 &&

          <div className="bg-white rounded-3xl shadow p-6 mt-5 text-center">

            <div className="text-5xl">
              🌱
            </div>

            <h3 className="font-bold text-xl mt-3">

              No Farm Added

            </h3>

            <p className="text-gray-500">

              Pehle apna farm add kare

            </p>


          </div>

        }





        {
          farms.map((farm)=>(


            <div

              key={farm.id}

              className="bg-white rounded-3xl shadow-lg p-6 mt-5 border border-green-100"

            >



              <div className="flex justify-between items-center">


                <h2 className="text-xl font-bold text-green-700">

                  🌾 {farm.name}

                </h2>



                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">

                  {farm.acres} Acre

                </span>


              </div>





              <div className="mt-4 space-y-2 text-gray-700">


                <p>
                  📍 Village:
                  <b> {farm.village}</b>
                </p>



                <p>
                  🏛 District:
                  <b> {farm.district || "-"}</b>
                </p>



                <p>
                  📌 Taluka:
                  <b> {farm.taluka || "-"}</b>
                </p>




                <p>

                  📄 Documents:

                  <b>
                    {" "}
                    {
                      documents.filter(
                        d=>d.khet_id===farm.id
                      ).length
                    }
                  </b>

                </p>



              </div>






              <button

                onClick={()=>{

                  setSelKhet(farm);

                  next();

                }}

                className="w-full mt-5 bg-green-600 text-white py-4 rounded-2xl font-bold text-lg"

              >

                ✅ Select This Farm

              </button>




            </div>


          ))

        }





        <button

          onClick={back}

          className="w-full mt-5 bg-gray-200 py-4 rounded-2xl font-bold"

        >

          ← Back

        </button>



      </div>


    </div>

  );

}
