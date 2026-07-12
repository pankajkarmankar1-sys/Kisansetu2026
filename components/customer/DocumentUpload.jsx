import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DocumentUpload({
  onDone,
}) {

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [satbara, setSatbara] = useState(null);

  const [loading, setLoading] = useState(false);


  async function uploadFile(file, userId, type) {

    if (!file) return null;


    const path =
      `${userId}/${Date.now()}-${type}-${file.name}`;


    const {
      error
    } = await supabase.storage
      .from("khet-documents")
      .upload(path, file);


    if (error) {
      throw error;
    }


    return path;
  }



  async function handleSubmit(e) {

    e.preventDefault();


    try {

      setLoading(true);



      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();



      if(!user){

        throw new Error(
          "Login required"
        );

      }



      const aadhaarFrontPath =
        await uploadFile(
          aadhaarFront,
          user.id,
          "aadhaar-front"
        );


      const aadhaarBackPath =
        await uploadFile(
          aadhaarBack,
          user.id,
          "aadhaar-back"
        );


      const satbaraPath =
        await uploadFile(
          satbara,
          user.id,
          "7-12"
        );




      const {
        error
      } =
      await supabase
      .from("profiles")
      .update({

        aadhaar_front:
          aadhaarFrontPath,

        aadhaar_back:
          aadhaarBackPath,

        satbara_7_12:
          satbaraPath,

        document_status:
          "pending"

      })
      .eq(
        "auth_user_id",
        user.id
      );



      if(error)
        throw error;




      alert(
        "✅ Documents uploaded successfully"
      );


      if(onDone){

        onDone();

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

    <div className="min-h-screen bg-green-50 p-5">

      <div className="bg-white rounded-3xl shadow p-6 max-w-xl mx-auto">


        <h2 className="text-2xl font-bold text-green-700">
          📄 Farmer Documents
        </h2>



        <label className="block mt-5">
          Aadhaar Front
        </label>

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e)=>
            setAadhaarFront(
              e.target.files[0]
            )
          }
        />



        <label className="block mt-5">
          Aadhaar Back
        </label>

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e)=>
            setAadhaarBack(
              e.target.files[0]
            )
          }
        />



        <label className="block mt-5">
          7/12 (Satbara)
        </label>

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
          className="w-full mt-6 bg-green-600 text-white p-4 rounded-xl font-bold"
        >

          {
            loading
            ?
            "Uploading..."
            :
            "Submit Documents"
          }

        </button>


      </div>

    </div>

  );

}
