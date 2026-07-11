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

      .select(`
        *,
        profiles(
          name,
          phone
        )
      `)

      .order(
        "created_at",
        {
          ascending:false
        }
      );





      if(error){

        console.log(error);

        return;

      }




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






  if(loading){

    return <p>Loading subscriptions...</p>;

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
        👑 Subscriptions
      </h2>





      {
        subscriptions.length===0

        ?

        <p>
          No subscriptions found
        </p>


        :


        subscriptions.map(sub=>(


          <div

            key={sub.id}

            style={{
              border:"1px solid #ddd",
              padding:12,
              marginBottom:10,
              borderRadius:10
            }}

          >


            <h3>
              {sub.profiles?.name || "Farmer"}
            </h3>



            <p>
              📱 {sub.profiles?.phone || "-"}
            </p>



            <p>
              🌾 Acres:
              {" "}
              {sub.acres || "-"}
            </p>



            <p>
              💰 Amount:
              {" "}
              ₹{sub.amount}
            </p>



            <p>
              📅 Expiry:
              {" "}
              {
              new Date(
                sub.end_date
              ).toLocaleDateString()
              }
            </p>



            <p>
              Status:
              {" "}
              {sub.status}
            </p>



          </div>


        ))

      }



    </div>

  );

}
