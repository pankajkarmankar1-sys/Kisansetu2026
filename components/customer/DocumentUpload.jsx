import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DocumentUpload({
  onDone,
}) {

  const [files,setFiles] = useState([]);
  const [loading,setLoading] = useState(false);


  function selectFiles(e){

    setFiles(
      Array.from(e.target.files || [])
    );

  }



  async function uploadDocuments(){

    try{

      setLoading(true);


      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();


      if(!user){

        alert("Login required");
        return;

      }



      for(const file of files){

        const path =
        `${user.id}/${Date.now()}-${file.name}`;


        const {
          error
        } = await supabase.storage
        .from("khet-documents")
        .upload(
          path,
          file
        );


        if(error)
          throw error;


      }


      alert("✅ Documents uploaded");


      if(onDone){
        onDone();
      }


    }
    catch(err){

      alert(err.message);

    }
    finally{

      setLoading(false);

    }

  }




  return (

    <div className="min-h-screen bg-green-50 p-5">

      <div className="bg-white rounded-3xl shadow p-6 max-w-xl mx-auto">

        <h2 className="text-2xl font-bold text-green-700">
          📄 Upload Documents
        </h2>


        <input

          type="file"

          multiple

          accept=".pdf,image/*"

          onChange={selectFiles}

          className="w-full mt-5 border p-3 rounded-xl"

        />



        <button

          onClick={uploadDocuments}

          disabled={loading}

          className="w-full mt-5 bg-green-600 text-white p-4 rounded-xl font-bold"

        >

          {
            loading
            ?
            "Uploading..."
            :
            "Upload 7/12 Documents"
          }

        </button>


      </div>

    </div>

  );

}
