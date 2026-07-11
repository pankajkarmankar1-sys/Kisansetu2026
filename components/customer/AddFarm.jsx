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







  async function uploadDocument(
    file,
    khetId,
    userId
  ){


    const fileName =

    `7-12/${userId}/${Date.now()}_${file.name}`;





    const {
      error
    } = await supabase.storage

    .from("customer-documents")

    .upload(

      fileName,

      file

    );





    if(error)
      throw error;






    const {
      data
    } = supabase.storage

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




      const { data, error } = await supabase.auth.getUser();

console.log("SUPABASE USER:", data.user);

const user = data.user;





      if(!user){

        alert(
          "Login required"
        );

        return;

      }







      const {
        data:khet,

        error

      } = await supabase

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







      for(
        const file of documents
      ){


        await uploadDocument(

          file,

          khet.id,

          user.id

        );


      }







      alert(
        "✅ Farm Added Successfully"
      );






      if(onSaved){

        onSaved();

      }





    }
    catch(err){


      alert(
        err.message
      );


    }
    finally{


      setLoading(false);


    }


  }









  return (

    <div
      style={{
        padding:20,
        background:"#f8fafc",
        minHeight:"100vh"
      }}
    >


      <h2>
        🌾 Add New Farm
      </h2>





      <input

        name="name"

        placeholder="Khet Name"

        value={farm.name}

        onChange={handleChange}

        style={input}

      />




      <input

        name="village"

        placeholder="Village"

        value={farm.village}

        onChange={handleChange}

        style={input}

      />




      <input

        name="farm_address"

        placeholder="Farm Address"

        value={farm.farm_address}

        onChange={handleChange}

        style={input}

      />




      <input

        name="acres"

        placeholder="Acres"

        type="number"

        value={farm.acres}

        onChange={handleChange}

        style={input}

      />




      <input

        name="state"

        placeholder="State"

        value={farm.state}

        onChange={handleChange}

        style={input}

      />




      <input

        name="district"

        placeholder="District"

        value={farm.district}

        onChange={handleChange}

        style={input}

      />




      <input

        name="taluka"

        placeholder="Taluka"

        value={farm.taluka}

        onChange={handleChange}

        style={input}

      />





      <h3>
        📄 7/12 Upload
      </h3>


      <p>
        Camera / Gallery / PDF / Multiple Files
      </p>



      <input

        type="file"

        accept="image/*,.pdf"

        multiple

        onChange={handleDocuments}

      />




      <p>
        Selected Files:
        {" "}
        {documents.length}
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
