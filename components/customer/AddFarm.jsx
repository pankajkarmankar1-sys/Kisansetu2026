import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function AddFarm({
  onSaved,
  back,
}) {


  const [loading,setLoading] = useState(false);

  const [farm,setFarm] = useState({

  name:"",
  village:"",
  state:"Maharashtra",
  district:"Chandrapur",
  taluka:"",
  farm_address:"",
  acres:"",
  latitude:"",
  longitude:""

});


  const [documents,setDocuments] = useState([]);

  const [message,setMessage] = useState("");





  function updateField(key,value){

    setFarm(prev=>({

      ...prev,

      [key]:value

    }));

  }






  useEffect(()=>{

    if(navigator.geolocation){

      navigator.geolocation.getCurrentPosition(

        (pos)=>{

          setFarm(prev=>({

            ...prev,

            latitude:pos.coords.latitude,

            longitude:pos.coords.longitude

          }));

        }

      );

    }

  },[]);







  function handleDocumentChange(e){

    setDocuments(
      Array.from(e.target.files || [])
    );

  }







  async function saveFarm(){


    try{


      setLoading(true);

      setMessage("");



      const {

        data:{
          user

        }

      } = await supabase.auth.getUser();





      if(!user){

        alert("Login required");

        return;

      }







      if(!farm.name || !farm.village || !farm.acres){

        alert(
          "Farm Name, Village aur Acre bharna jaruri hai"
        );

        return;

      }






      const {

        data,

        error

      } = await supabase

      .from("khets")

      .insert({

        user_id:user.id,

        ...farm,

        acres:Number(farm.acres)

      })

      .select()

      .single();





      if(error)
        throw error;






      setMessage(
        "✅ Farm Added Successfully"
      );





      if(onSaved){

        onSaved(data);

      }




    }

    catch(err){

      console.log(err);

      alert(err.message);

    }

    finally{

      setLoading(false);

    }


  }







  return (

    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-5">


      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-6">


        <h1 className="text-3xl font-bold text-green-700">

          🌾 Add New Farm

        </h1>


        <p className="text-gray-500 mt-2">

          Apna khet aur 7/12 details add kare

        </p>





        {
          message &&

          <div className="bg-green-100 text-green-700 p-3 rounded-xl mt-4">

            {message}

          </div>

        }





        <div className="space-y-4 mt-6">


          <input
            placeholder="🌾 Farm Name"
            value={farm.name}
            onChange={(e)=>updateField("name",e.target.value)}
            className="w-full p-4 rounded-2xl border"
          />



          <input
            placeholder="📍 Village"
            value={farm.village}
            onChange={(e)=>updateField("village",e.target.value)}
            className="w-full p-4 rounded-2xl border"
          />



          <input
            placeholder="🏙 District"
            value={farm.district}
            onChange={(e)=>updateField("district",e.target.value)}
            className="w-full p-4 rounded-2xl border"
          />



          <input
            placeholder="📌 Taluka"
            value={farm.taluka}
            onChange={(e)=>updateField("taluka",e.target.value)}
            className="w-full p-4 rounded-2xl border"
          />



          <input
            type="number"
            placeholder="📏 Total Acre"
            value={farm.acres}
            onChange={(e)=>updateField("acres",e.target.value)}
            className="w-full p-4 rounded-2xl border"
          />



          <textarea
            placeholder="🏡 Farm Address"
            value={farm.farm_address}
            onChange={(e)=>updateField("farm_address",e.target.value)}
            className="w-full p-4 rounded-2xl border"
          />


        </div>





        <div className="bg-green-50 rounded-2xl p-4 mt-5">


          <h3 className="font-bold">

            📍 GPS Location

          </h3>


          <p className="text-sm mt-2">

            Latitude: {farm.latitude || "Detecting..."}

          </p>


          <p className="text-sm">

            Longitude: {farm.longitude || "Detecting..."}

          </p>


        </div>






        <div className="mt-5">


          <h3 className="font-bold mb-2">

            📄 Upload 7/12 Document

          </h3>


          <input

            type="file"

            multiple

            accept=".pdf,image/*"

            onChange={handleDocumentChange}

            className="w-full border p-3 rounded-xl"

          />


        </div>






        <div className="flex gap-3 mt-6">


          <button

            onClick={back}

            className="flex-1 bg-gray-200 p-4 rounded-2xl font-bold"

          >

            ← Back

          </button>





          <button

            onClick={saveFarm}

            disabled={loading}

            className="flex-1 bg-green-600 text-white p-4 rounded-2xl font-bold"

          >

            {
              loading
              ?
              "Saving..."
              :
              "💾 Save Farm"
            }

          </button>



        </div>



      </div>


    </div>


  );

}
