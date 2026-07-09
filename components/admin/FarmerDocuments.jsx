import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function FarmerDocuments() {


  const [farmers,setFarmers] = useState([]);

  const [loading,setLoading] = useState(true);

  const [actionLoading,setActionLoading] = useState(false);

  const [reason,setReason] = useState("");

  const [selectedId,setSelectedId] = useState(null);





  useEffect(()=>{

    loadDocuments();

  },[]);







  async function loadDocuments(){


    try{


      setLoading(true);



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
        document_status,
        document_reject_reason,
        created_at

      `)

      .eq(
        "role",
        "farmer"
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );





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









  async function updateStatus(
    id,
    status,
    rejectReason=""
  ){


    try{


      setActionLoading(true);



      const {

        data:{
          user

        }

      } = await supabase.auth.getUser();






      const {

        data:farmer

      } = await supabase

      .from("profiles")

      .select(
        "auth_user_id,name"
      )

      .eq(
        "id",
        id
      )

      .single();







      await supabase

      .from("profiles")

      .update({

        document_status:
          status,


        document_reject_reason:

          status==="rejected"

          ?

          rejectReason

          :

          null,


        verified_by:
          user?.id || null,


        verified_at:
          new Date().toISOString()

      })

      .eq(
        "id",
        id
      );








      await supabase

      .from("notifications")

      .insert([{

        user_id:
          farmer.auth_user_id,


        title:

          status==="approved"

          ?

          "✅ Documents Approved"

          :

          "❌ Documents Rejected",



        message:

          status==="approved"

          ?

          "Documents approve ho gaye. Ab booking kar sakte hain."

          :

          `Reject reason: ${rejectReason}`


      }]);






      setReason("");

      setSelectedId(null);


      loadDocuments();



    }
    catch(err){

      console.log(err);

    }
    finally{

      setActionLoading(false);

    }


  }







  if(loading){

    return <h3>Loading Documents...</h3>;

  }







  return (

    <div>


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

              marginTop:15,

              borderRadius:10,

              border:"1px solid #ddd"

            }}

          >



            <h3>
              👨‍🌾 {farmer.name || "Farmer"}
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

                    Aadhaar Front

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

                    Aadhaar Back

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

                    7/12 Document

                  </a>

                </p>

              )
            }







            <button

              disabled={actionLoading}

              onClick={()=>updateStatus(
                farmer.id,
                "approved"
              )}

              style={{

                background:"#16a34a",

                color:"#fff",

                padding:10,

                border:"none",

                borderRadius:8,

                marginRight:10

              }}

            >

              ✅ Approve

            </button>







            <button

              onClick={()=>setSelectedId(farmer.id)}

              style={{

                background:"#dc2626",

                color:"#fff",

                padding:10,

                border:"none",

                borderRadius:8

              }}

            >

              ❌ Reject

            </button>







            {
              selectedId===farmer.id && (

                <div style={{marginTop:15}}>


                  <input

                    placeholder="Reject reason"

                    value={reason}

                    onChange={(e)=>
                      setReason(e.target.value)
                    }

                    style={{

                      width:"100%",

                      padding:10

                    }}

                  />



                  <button

                    onClick={()=>updateStatus(
                      farmer.id,
                      "rejected",
                      reason
                    )}

                    style={{

                      marginTop:10,

                      padding:10

                    }}

                  >

                    Submit Reject

                  </button>



                </div>

              )
            }




          </div>


        ))

      }



    </div>

  );

}
