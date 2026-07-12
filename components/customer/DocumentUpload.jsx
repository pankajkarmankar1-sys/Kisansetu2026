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


    if(error){
      throw error;
    }


    return path;

  }




  async function handleSubmit(e){

    e.preventDefault();


    try{

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




      if(!aadhaarFront || !aadhaarBack || !satbara){

        throw new Error(
          "Please upload all documents"
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


      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-6">


        <div className="text-center">

          <div className="text-5xl">
            📄
          </div>


          <h2 className="text-2xl font-bold text-green-700 mt-3">
            Farmer Documents
          </h2>


          <p className="text-gray-500 mt-2">
            Upload Aadhaar & 7/12 documents
          </p>


        </div>





        <div className="mt-6 space-y-5">



          <div className="bg-green-50 rounded-2xl p-4">

            <h3 className="font-bold">
              🪪 Aadhaar Front
            </h3>


            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e)=>
                setAadhaarFront(
                  e.target.files[0]
                )
              }
              className="mt-3 w-full"
            />


            {
              aadhaarFront &&
              <p className="text-green-600 text-sm mt-2">
                ✅ {aadhaarFront.name}
              </p>
            }


          </div>





          <div className="bg-green-50 rounded-2xl p-4">

            <h3 className="font-bold">
              🪪 Aadhaar Back
            </h3>


            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e)=>
                setAadhaarBack(
                  e.target.files[0]
                )
              }
              className="mt-3 w-full"
            />


            {
              aadhaarBack &&
              <p className="text-green-600 text-sm mt-2">
                ✅ {aadhaarBack.name}
              </p>
            }


          </div>






          <div className="bg-green-50 rounded-2xl p-4">

            <h3 className="font-bold">
              📜 7/12 Satbara
            </h3>


            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e)=>
                setSatbara(
                  e.target.files[0]
                )
              }
              className="mt-3 w-full"
            />


            {
              satbara &&
              <p className="text-green-600 text-sm mt-2">
                ✅ {satbara.name}
              </p>
            }


          </div>



        </div>





        <button

          onClick={handleSubmit}

          disabled={loading}

          className="w-full mt-7 bg-green-600 text-white p-4 rounded-2xl font-bold text-lg"

        >

          {
            loading
            ?
            "Uploading..."
            :
            "✅ Submit Documents"
          }


        </button>



      </div>


    </div>

  );

}
