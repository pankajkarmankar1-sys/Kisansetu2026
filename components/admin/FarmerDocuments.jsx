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
          name,
          phone,
          aadhaar_front,
          aadhaar_back,
          satbara_7_12,
          document_status
        `)
        .eq("role","farmer")
        .order("created_at",{ascending:false});


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




  async function updateStatus(id,status) {

    try {

      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();



      const {
        error
      } = await supabase
        .from("profiles")
        .update({

          document_status:status,

          verified_by:user?.id || null,

          verified_at:new Date().toISOString()

        })
        .eq("id",id);



      if(error)
        throw error;



      loadDocuments();


    }
    catch(err){

      console.log(err);

    }

  }




  if(loading){

    return <h3>Loading Documents...</h3>;

  }



  return (

    <div
      style={{
        padding:20
      }}
    >

      <h2>
        📄 Farmer Documents Verification
      </h2>


      {
        farmers.map((farmer)=>(


          <div
            key={farmer.id}
            style={{
              background:"#fff",
              padding:15,
              marginBottom:15,
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
              farmer.aadhaar_front &&

              <a
                href={farmer.aadhaar_front}
                target="_blank"
              >
                Aadhaar Front
              </a>

            }


            <br/>


            {
              farmer.aadhaar_back &&

              <a
                href={farmer.aadhaar_back}
                target="_blank"
              >
                Aadhaar Back
              </a>

            }


            <br/>


            {
              farmer.satbara_7_12 &&

              <a
                href={farmer.satbara_7_12}
                target="_blank"
              >
                7/12 Document
              </a>

            }



            <br/><br/>



            <button
              onClick={()=>
                updateStatus(
                  farmer.id,
                  "approved"
                )
              }
              style={{
                padding:10,
                background:"#16a34a",
                color:"#fff",
                border:"none",
                borderRadius:8,
                marginRight:10
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
