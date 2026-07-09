import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function FarmerDocuments() {

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    loadDocuments();

  }, []);



  async function loadDocuments() {

    try {

      const {
        data,
        error
      } = await supabase
        .from("profiles")
        .select(`
          id,
          auth_user_id,
          name,
          phone,
          aadhaar_front,
          aadhaar_back,
          satbara_7_12,
          document_status
        `)
        .eq("role", "farmer")
        .order("created_at", {
          ascending:false
        });


      if(error)
        throw error;


      setFarmers(data || []);


    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  }




  async function updateStatus(id, status) {

    try {


      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();



      const {
        data:farmer,
        error:farmerError
      } = await supabase
        .from("profiles")
        .select("auth_user_id,name")
        .eq("id", id)
        .single();



      if(farmerError)
        throw farmerError;



      const {
        error
      } = await supabase
        .from("profiles")
        .update({

          document_status:status,

          verified_by:
            user?.id || null,

          verified_at:
            new Date().toISOString()

        })
        .eq("id",id);



      if(error)
        throw error;




      await supabase
        .from("notifications")
        .insert([{

          user_id:
            farmer.auth_user_id,


          title:
            status === "approved"
            ?
            "✅ Documents Approved"
            :
            "❌ Documents Rejected",



          message:
            status === "approved"
            ?
            "Aapke Aadhaar aur 7/12 documents approve ho gaye hain. Ab booking kar sakte hain."
            :
            "Documents reject hue hain. Kripya documents dobara upload karein."

        }]);



      loadDocuments();



    }
    catch(err){

      console.log(err);

    }

  }




  if(loading){

    return (
      <h3>
        Loading Documents...
      </h3>
    );

  }



  return (

    <div>

      <h2>
        📄 Farmer Documents Verification
      </h2>



      {
        farmers.length === 0 && (

          <p>
            No farmer documents found
          </p>

        )
      }



      {
        farmers.map((farmer)=>(


          <div
            key={farmer.id}
            style={{
              background:"#fff",
              padding:15,
              marginTop:15,
              borderRadius:10,
              border:"1px solid #ddd"
            }}
          >


            <h3>
              👨‍🌾 {farmer.name}
            </h3>


            <p>
              📱 {farmer.phone}
            </p>


            <p>
              Status:
              {" "}
              {farmer.document_status}
            </p>



            {
              farmer.aadhaar_front && (

                <p>
                  <a
                    href={farmer.aadhaar_front}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📄 Aadhaar Front
                  </a>
                </p>

              )
            }



            {
              farmer.aadhaar_back && (

                <p>
                  <a
                    href={farmer.aadhaar_back}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📄 Aadhaar Back
                  </a>
                </p>

              )
            }




            {
              farmer.satbara_7_12 && (

                <p>
                  <a
                    href={farmer.satbara_7_12}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📄 7/12 Document
                  </a>
                </p>

              )
            }




            <button
              onClick={()=>
                updateStatus(
                  farmer.id,
                  "approved"
                )
              }
              style={{
                padding:10,
                marginRight:10,
                background:"#16a34a",
                color:"#fff",
                border:"none",
                borderRadius:8
              }}
            >
              ✅ Approve
            </button>




            <button
              onClick={()=>
                updateStatus(
                  farmer.id,
                  "rejected"
                )
              }
              style={{
                padding:10,
                background:"#dc2626",
                color:"#fff",
                border:"none",
                borderRadius:8
              }}
            >
              ❌ Reject
            </button>



          </div>


        ))
      }



    </div>

  );

}
