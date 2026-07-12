import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AddFarm({
  onSaved,
  back,
}) {

  const [loading, setLoading] = useState(false);

  const [farm, setFarm] = useState({
    name: "",
    village: "",
    state: "Maharashtra",
    district: "",
    taluka: "",
    farm_address: "",
    acres: "",
    latitude: "",
    longitude: "",
  });

  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");


  function updateField(key,value){
    setFarm(prev=>({
      ...prev,
      [key]:value
    }));
  }


  useEffect(()=>{

    if(!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position)=>{

        setFarm(prev=>({
          ...prev,
          latitude:position.coords.latitude,
          longitude:position.coords.longitude
        }));

      },
      ()=>{}
    );

  },[]);



  function handleDocumentChange(e){

    const files = Array.from(
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
      } =
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
      } =
      supabase.storage
      .from("khet-documents")
      .getPublicUrl(
        fileName
      );


      const {
        error:dbError
      } =
      await supabase
      .from("khet_documents")
      .insert({

        khet_id:khetId,
        user_id:userId,
        document_type:"7/12",
        document_name:file.name,
        document_url:urlData.publicUrl,
        file_url:urlData.publicUrl

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
        data:{user},
        error:userError
      }
      =
      await supabase.auth.getUser();



      if(userError)
      throw userError;



      if(!user){

        alert("Login required");
        return;

      }



      if(!farm.name.trim()){

        alert("Enter Farm Name");
        return;

      }



      if(!farm.village.trim()){

        alert("Enter Village");
        return;

      }



      if(!farm.acres){

        alert("Enter Acres");
        return;

      }



      const {
        data:insertedFarm,
        error:insertError
      }
      =
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
        latitude:farm.latitude,
        longitude:farm.longitude

      })
      .select()
      .single();



      if(insertError)
      throw insertError;



      if(documents.length > 0){

        await uploadDocuments(
          insertedFarm.id,
          user.id
        );

      }



      setMessage(
        "✅ Farm Added Successfully"
      );


      if(onSaved){

        onSaved(insertedFarm);

      }



    }
    catch(error){

      console.log(error);

      alert(
        error.message
      );

    }
    finally{

      setLoading(false);

    }

  }





return (

<div className="min-h-screen bg-green-50 p-5">


<div className="bg-white rounded-2xl shadow-lg p-5">


<h2 className="text-2xl font-bold text-green-700 mb-5">
🌾 Add New Farm
</h2>


{message &&

<div className="bg-green-100 p-3 rounded mb-4">
{message}
</div>

}



<input
className="w-full border p-3 rounded-xl mb-3"
placeholder="Farm Name"
value={farm.name}
onChange={(e)=>updateField("name",e.target.value)}
/>



<input
className="w-full border p-3 rounded-xl mb-3"
placeholder="Village"
value={farm.village}
onChange={(e)=>updateField("village",e.target.value)}
/>



<input
className="w-full border p-3 rounded-xl mb-3"
placeholder="District"
value={farm.district}
onChange={(e)=>updateField("district",e.target.value)}
/>



<input
className="w-full border p-3 rounded-xl mb-3"
placeholder="Taluka"
value={farm.taluka}
onChange={(e)=>updateField("taluka",e.target.value)}
/>



<input
className="w-full border p-3 rounded-xl mb-3"
placeholder="Area Acres"
type="number"
value={farm.acres}
onChange={(e)=>updateField("acres",e.target.value)}
/>



<input
className="w-full border p-3 rounded-xl mb-3"
placeholder="Farm Address"
value={farm.farm_address}
onChange={(e)=>updateField("farm_address",e.target.value)}
/>



<div className="bg-green-100 rounded-xl p-3 mb-4">

📍 GPS Saved

<br/>

Lat:
{farm.latitude}

<br/>

Long:
{farm.longitude}

</div>




<div className="border rounded-xl p-4 mb-4">


<label className="font-bold">
📄 Upload 7/12 Documents
</label>


<input
type="file"
multiple
accept="image/*,.pdf"
onChange={handleDocumentChange}
className="mt-3 w-full"
/>



</div>




<div className="flex gap-3">


<button
onClick={back}
className="flex-1 bg-gray-300 p-3 rounded-xl"
>
Back
</button>



<button
onClick={saveFarm}
disabled={loading}
className="flex-1 bg-green-600 text-white p-3 rounded-xl"
>

{
loading
?
"Saving..."
:
"Save Farm"
}

</button>



</div>


</div>


</div>

);


}
