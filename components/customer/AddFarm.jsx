import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AddFarm({
  onSaved,
  back,
}) {

  const [farm,setFarm] = useState({
    name:"",
    village:"",
    farm_address:"",
    acres:"",
    state:"",
    district:"",
    taluka:""
  });


  const [documents,setDocuments] = useState([]);

  const [loading,setLoading] = useState(false);


  function handleChange(e){

    setFarm({
      ...farm,
      [e.target.name]:e.target.value
    });

  }



  function handleDocuments(e){

    setDocuments(
      Array.from(e.target.files)
    );

  }



  async function uploadDocument(file,khetId,userId){


    const fileName =
    `7-12/${userId}/${Date.now()}_${file.name}`;


    const {
      error
    } =
    await supabase.storage
    .from("customer-documents")
    .upload(
      fileName,
      file
    );


    if(error)
      throw error;



    const {
      data
    } =
    supabase.storage
    .from("customer-documents")
    .getPublicUrl(
      fileName
    );



    await supabase
    .from("khet_documents")
    .insert([{

      khet_id:khetId,

      user_id:userId,

      document_type:"7/12",

      file_url:data.publicUrl

    }]);


  }





  async function saveFarm(){

    try{

      setLoading(true);


      const {
        data:{
          user
        }
      } =
      await supabase.auth.getUser();



      if(!user){

        alert("Login required");
        return;

      }



      const {
        data:khet,
        error
      } =
      await supabase
      .from("khets")
      .insert([{

        user_id:user.id,

        name:farm.name,

        village:farm.village,

        farm_address:farm.farm_address,

        acres:Number(farm.acres),

        state:farm.state,

        district:farm.district,

        taluka:farm.taluka

      }])
      .select()
      .single();



      if(error)
        throw error;



      for(const file of documents){

        await uploadDocument(
          file,
          khet.id,
          user.id
        );

      }



      alert("✅ Farm Added Successfully");


      if(onSaved)
        onSaved();


    }
    catch(err){

      alert(err.message);

    }
    finally{

      setLoading(false);

    }

  }





  return (

    <div style={{padding:20}}>

      <h2>
        🌾 Add New Farm
      </h2>


      {
        Object.keys(farm).map((key)=>(

          <input

            key={key}

            name={key}

            placeholder={key.replace("_"," ").toUpperCase()}

            value={farm[key]}

            onChange={handleChange}

            style={input}

          />

        ))
      }



      <h3>
        📄 Upload 7/12 Documents
      </h3>


      <input

        type="file"

        accept="image/*,.pdf"

        multiple

        capture="environment"

        onChange={handleDocuments}

      />



      <p>
        {documents.length} files selected
      </p>




      <button

        onClick={saveFarm}

        disabled={loading}

        style={button}

      >

        {
          loading
          ?
          "Saving..."
          :
          "✅ Save Farm"
        }

      </button>



      <button

        onClick={back}

        style={{
          ...button,
          background:"#64748b",
          marginTop:10
        }}

      >

        ← Back

      </button>


    </div>

  );

}



const input={

 width:"100%",
 padding:12,
 marginBottom:12,
 borderRadius:8,
 border:"1px solid #ccc"

};


const button={

 width:"100%",
 padding:14,
 background:"#16a34a",
 color:"#fff",
 border:"none",
 borderRadius:10,
 fontSize:16

};
