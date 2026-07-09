import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DocumentUpload({
  onDone,
}) {

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [satbara, setSatbara] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");


  async function uploadFile(file, folder) {

    if (!file) return null;


    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();


    if(!user){
      throw new Error("Login required");
    }


    const fileName =
      `${folder}/${user.id}_${Date.now()}_${file.name}`;


    const {
      error
    } = await supabase.storage
      .from("customer-documents")
      .upload(
        fileName,
        file
      );


    if(error){
      throw error;
    }


    const {
      data
    } =
    supabase.storage
      .from("customer-documents")
      .getPublicUrl(fileName);


    return data.publicUrl;

  }



  async function handleSubmit(){

    try{

      if(
        !aadhaarFront ||
        !aadhaarBack ||
        !satbara
      ){

        setMsg("Please upload all documents");
        return;

      }


      setLoading(true);
      setMsg("Uploading...");


      const frontUrl =
        await uploadFile(
          aadhaarFront,
          "aadhaar-front"
        );


      const backUrl =
        await uploadFile(
          aadhaarBack,
          "aadhaar-back"
        );


      const satbaraUrl =
        await uploadFile(
          satbara,
          "7-12"
        );



      const {
        data:{
          user
        }
      } =
      await supabase.auth.getUser();



      const {
        error
      } =
      await supabase
      .from("profiles")
      .update({

        aadhaar_front: frontUrl,

        aadhaar_back: backUrl,

        satbara_7_12: satbaraUrl,

        document_status:"pending"

      })
      .eq(
        "auth_user_id",
        user.id
      );



      if(error)
        throw error;



      setMsg(
        "Documents uploaded successfully"
      );


      if(onDone){
        onDone();
      }


    }
    catch(err){

      console.log(err);

      setMsg(err.message);

    }
    finally{

      setLoading(false);

    }

  }



  return (

    <div
      style={{
        padding:20
      }}
    >

      <h2>
        📄 Upload Documents
      </h2>


      <p>
        Aadhaar Front
      </p>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e)=>
          setAadhaarFront(
            e.target.files[0]
          )
        }
      />


      <p>
        Aadhaar Back
      </p>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e)=>
          setAadhaarBack(
            e.target.files[0]
          )
        }
      />


      <p>
        7/12 Document
      </p>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e)=>
          setSatbara(
            e.target.files[0]
          )
        }
      />


      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop:20,
          width:"100%",
          padding:14,
          background:"#16a34a",
          color:"#fff",
          border:"none",
          borderRadius:10
        }}
      >

        {
          loading
          ?
          "Uploading..."
          :
          "✅ Submit Documents"
        }

      </button>


      <p>
        {msg}
      </p>


    </div>

  );

}
