import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import LocationSelector from "../maps/LocationSelector";

export default function AddFarm({
  onSaved,
  back,
}) {

  const [loading, setLoading] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const [farm, setFarm] = useState({
    name: "",
    village: "",
    state: "Maharashtra",
    district: "Chandrapur",
    taluka: "",
    farm_address: "",
    acres: "",
    latitude: "",
    longitude: "",
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
        data:{user},
        error:userError
      } = await supabase.auth.getUser();


      if(userError)
        throw userError;


      if(!user){

        alert("Login required");
        return;

      }



      if(
        !farm.name ||
        !farm.village ||
        !farm.acres
      ){

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






      for(const file of documents){


        const path =
        `${user.id}/${data.id}/${Date.now()}-${file.name}`;



        const {
          error:uploadError
        } =
        await supabase.storage
        .from("khet-documents")
        .upload(
          path,
          file
        );



        if(uploadError)
          throw uploadError;




        const {
          data:{publicUrl}
        } =
        supabase.storage
        .from("khet-documents")
        .getPublicUrl(path);





        await supabase
        .from("khet_documents")
        .insert({

          khet_id:data.id,

          user_id:user.id,

          document_type:"7/12",

          document_name:file.name,

          file_url:path,

          document_url:publicUrl

        });


      }





      setMessage(
        "✅ Farm Added Successfully"
      );


      if(onSaved)
        onSaved(data);



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

<div className="min-h-screen bg-green-50 p-5">


<div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-6">


<h1 className="text-3xl font-bold text-green-700">
🌾 Add New Farm
</h1>


{message &&

<div className="bg-green-100 text-green-700 p-3 rounded-xl mt-4">

{message}

</div>

}




<div className="space-y-4 mt-6">


<input

placeholder="🌾 Farm Name"

value={farm.name}

onChange={(e)=>
updateField(
"name",
e.target.value
)}

className="w-full p-4 rounded-2xl border"

/>





<button

onClick={()=>
setShowLocation(true)
}

className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold"

>

📍 Select Farm Location

</button>





{
showLocation &&

<LocationSelector

onSelect={(loc)=>{


setFarm(prev=>({

...prev,

state:loc.state,

district:loc.district,

taluka:loc.taluka,

village:loc.village

}));


setShowLocation(false);


}}

/>

}






<div className="bg-green-50 p-4 rounded-2xl">


<p>State : {farm.state}</p>

<p>District : {farm.district}</p>

<p>Taluka : {farm.taluka}</p>

<p>Village : {farm.village}</p>


</div>





<input

type="number"

placeholder="📏 Total Acre"

value={farm.acres}

onChange={(e)=>
updateField(
"acres",
e.target.value
)}

className="w-full p-4 rounded-2xl border"

/>





<textarea

placeholder="🏡 Farm Address"

value={farm.farm_address}

onChange={(e)=>
updateField(
"farm_address",
e.target.value
)}

className="w-full p-4 rounded-2xl border"

/>


</div>





<div className="bg-green-50 rounded-2xl p-4 mt-5">

<h3 className="font-bold">
📍 GPS Location
</h3>

<p>
Latitude: {farm.latitude || "Detecting..."}
</p>

<p>
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
