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
    district:"",
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

    if(!navigator.geolocation)
      return;


    navigator.geolocation.getCurrentPosition(

      (position)=>{

        setFarm(prev=>({

          ...prev,

          latitude:
          position.coords.latitude,

          longitude:
          position.coords.longitude

        }));

      },

      ()=>{}

    );


  },[]);





  function handleDocumentChange(e){

    const files =
    Array.from(
      e.target.files || []
    );


    setDocuments(files);

  }




  async function uploadDocuments(khetId,userId){


    for(const file of documents){


      const fileName =
      `${userId}/${Date.now()}-${file.name}`;



      const {
        error:uploadError
      }
      =
      await supabase.storage
      .from("khet-documents")
      .upload(
        fileName,
        file
      );



      if(uploadError)
        throw uploadError;




      const {
        data:urlData
      }
      =
      supabase.storage
      .from("khet-documents")
      .getPublicUrl(
        fileName
      );



      const {
        error:dbError
      }
      =
      await supabase
      .from("khet_documents")
      .insert({

        khet_id:khetId,

        user_id:userId,

        document_name:file.name,

        document_url:
        urlData.publicUrl,

        document_type:"7/12"

      });



      if(dbError)
        throw dbError;


    }


  }
  async function saveFarm(){

    try{

      setLoading(true);
      setMessage("");



      const {
        data:{
          user
        },
        error:userError

      } =
      await supabase.auth.getUser();



      if(userError)
        throw userError;



      if(!user){

        alert("Login required");
        return;

      }




      if(!farm.name.trim()){

        alert("Farm Name bharna jaruri hai");
        return;

      }



      if(!farm.village.trim()){

        alert("Village bharna jaruri hai");
        return;

      }



      if(!farm.acres){

        alert("Acres bharna jaruri hai");
        return;

      }






      const {
        data:insertedFarm,
        error:insertError

      } =
      await supabase

      .from("khets")

      .insert({

        user_id:user.id,

        name:farm.name,

        village:farm.village,

        state:farm.state,

        district:farm.district,

        taluka:farm.taluka,

        farm_address:farm.farm_address,

        acres:Number(farm.acres),

        latitude:
        farm.latitude || null,

        longitude:
        farm.longitude || null

      })

      .select()

      .single();





      if(insertError)
        throw insertError;






      await uploadDocuments(

        insertedFarm.id,

        user.id

      );






      setMessage(
        "✅ Farm Added Successfully"
      );




      setFarm({

        name:"",
        village:"",
        state:"Maharashtra",
        district:"",
        taluka:"",
        farm_address:"",
        acres:"",
        latitude:"",
        longitude:""

      });



      setDocuments([]);




      if(onSaved){

        onSaved(insertedFarm);

      }



    }

    catch(error){

      console.log(error);

      setMessage(
        error.message
      );


    }

    finally{

      setLoading(false);

    }


  }






  return (

    <div className="min-h-screen bg-green-50 p-5">


      <div className="bg-white rounded-3xl shadow p-5">


        <h2 className="text-2xl font-bold text-green-700 mb-5">

          🌾 Add Another 7/12 Farm

        </h2>





        {
          message &&

          <div className="bg-green-100 p-3 rounded-xl mb-4">

            {message}

          </div>

        }




        <input
          placeholder="Farm Name"
          value={farm.name}
          onChange={(e)=>
            updateField(
              "name",
              e.target.value
            )
          }
          className="w-full border rounded-xl p-3 mb-3"
        />



        <input
          placeholder="Village Name"
          value={farm.village}
          onChange={(e)=>
            updateField(
              "village",
              e.target.value
            )
          }
          className="w-full border rounded-xl p-3 mb-3"
        />



        <input
          placeholder="District"
          value={farm.district}
          onChange={(e)=>
            updateField(
              "district",
              e.target.value
            )
          }
          className="w-full border rounded-xl p-3 mb-3"
        />



        <input
          placeholder="Taluka"
          value={farm.taluka}
          onChange={(e)=>
            updateField(
              "taluka",
              e.target.value
            )
          }
          className="w-full border rounded-xl p-3 mb-3"
        />



        <input
          type="number"
          placeholder="Area Acres"
          value={farm.acres}
          onChange={(e)=>
            updateField(
              "acres",
              e.target.value
            )
          }
          className="w-full border rounded-xl p-3 mb-3"
        />
        <input
          placeholder="Farm Address"
          value={farm.farm_address}
          onChange={(e)=>
            updateField(
              "farm_address",
              e.target.value
            )
          }
          className="w-full border rounded-xl p-3 mb-3"
        />



        <div className="grid grid-cols-2 gap-3 mb-4">


          <input
            value={farm.latitude}
            readOnly
            placeholder="Latitude"
            className="border rounded-xl p-3 bg-gray-100"
          />


          <input
            value={farm.longitude}
            readOnly
            placeholder="Longitude"
            className="border rounded-xl p-3 bg-gray-100"
          />


        </div>





        <div className="bg-green-50 rounded-2xl p-4 mb-5">


          <label className="font-bold block mb-2">

            📄 Upload 7/12 Documents

          </label>



          <input

            type="file"

            multiple

            accept=".pdf,image/*"

            onChange={handleDocumentChange}

            className="w-full border p-3 rounded-xl"

          />



          {
            documents.length > 0 &&

            <div className="mt-3">

              <p className="font-semibold">

                Selected Files:

              </p>


              {
                documents.map((file,index)=>(

                  <p key={index}>

                    📎 {file.name}

                  </p>

                ))

              }


            </div>

          }



        </div>







        <div className="flex gap-3">


          <button

            onClick={back}

            className="flex-1 bg-gray-300 rounded-xl p-3 font-bold"

          >

            ← Back

          </button>





          <button

            onClick={saveFarm}

            disabled={loading}

            className="flex-1 bg-green-600 text-white rounded-xl p-3 font-bold"

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
