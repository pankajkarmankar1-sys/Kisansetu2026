import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function SubscriptionList(){


  const [subscriptions,setSubscriptions] = useState([]);

  const [loading,setLoading] = useState(true);




  useEffect(()=>{

    loadSubscriptions();

  },[]);







  async function loadSubscriptions(){


    try{


      const {
        data,
        error
      } = await supabase

      .from("subscriptions")

      .select("*")

      .order(
        "created_at",
        {
          ascending:false
        }
      );





      if(error)
        throw error;



      setSubscriptions(
        data || []
      );



    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }


  }







  return (

    <div

      style={{

        background:"#fff",

        padding:15,

        borderRadius:12

      }}

    >


      <h2>
        👑 Subscription List
      </h2>





      {
        loading

        ?

        <p>
          Loading...
        </p>


        :


        subscriptions.length === 0

        ?

        <p>
          No Subscription Found
        </p>


        :


        subscriptions.map((sub)=>(


          <div

            key={sub.id}

            style={{

              border:"1px solid #ddd",

              padding:12,

              marginTop:10,

              borderRadius:10

            }}

          >


            <p>
              👤 User ID:
              {" "}
              {sub.user_id}
            </p>



            <p>
              🌾 Acres:
              {" "}
              {sub.acres || 0}
            </p>



            <p>
              💰 Amount:
              {" "}
              ₹{sub.amount}
            </p>



            <p>
              Status:
              {" "}
              {sub.status}
            </p>



            <p>
              Start:
              {" "}
              {
              sub.start_date
              ?
              new Date(
                sub.start_date
              ).toLocaleDateString()
              :
              "-"
              }
            </p>




            <p>
              End:
              {" "}
              {
              sub.end_date
              ?
              new Date(
                sub.end_date
              ).toLocaleDateString()
              :
              "-"
              }
            </p>



          </div>


        ))

      }




    </div>

  );

}
