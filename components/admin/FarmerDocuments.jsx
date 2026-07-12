import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function FarmerDocuments(){

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

      .select("*")

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

      console.log(err.message);

    }
    finally{

      setLoading(false);

    }


  }





  async function updateStatus(
    farmer,
    status
  ){


    try{


      setActionLoading(true);



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

        document_reject_reason:

        status==="rejected"

        ?

        reason

        :

        null,


        verified_by:user?.id || null,

        verified_at:
        new Date().toISOString()


      })

      .eq(
        "id",
        farmer.id
      );





      if(error)
        throw error;





      await supabase

      .from("notifications")

      .insert([{

        user_id:
        farmer.auth_user_id,


        title:

        status==="approved"

        ?

        "Documents Approved"

        :

        "Documents Rejected",



        message:

        status==="approved"

        ?

        "Your documents are approved. You can book service."

        :

        `Rejected Reason: ${reason}`


      }]);





      alert(
        "Status Updated"
      );


      setReason("");

      setSelectedId(null);


      loadDocuments();



    }
    catch(err){

      alert(err.message);

    }
    finally{

      setActionLoading(false);

    }


  }






  if(loading){

    return <h3>Loading Documents...</h3>;

  }







  return (

    <div

      style={{

        background:"#fff",

        padding:20,

        borderRadius:12

      }}

    >


      <h2>
        📄 Farmer Verification
      </h2>





      {
        farmers.map((farmer)=>(


          <div

          key={farmer.id}

          style={{

            border:"1px solid #ddd",

            padding:15,

            marginTop:15,

            borderRadius:10

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

              {farmer.document_status || "Pending"}

            </p>





            <button

            disabled={actionLoading}

            onClick={()=>updateStatus(
              farmer,
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
              selectedId===farmer.id &&

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
                  farmer,
                  "rejected"
                )}

                style={{

                  marginTop:10,

                  padding:10

                }}

                >

                  Submit Reject

                </button>


              </div>

            }



          </div>


        ))

      }


    </div>

  );


}
