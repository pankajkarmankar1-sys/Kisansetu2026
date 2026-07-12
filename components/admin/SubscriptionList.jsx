import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function SubscriptionList(){


  const [subscriptions,setSubscriptions] = useState([]);

  const [loading,setLoading] = useState(true);





  useEffect(()=>{


    loadSubscriptions();



    const channel = supabase

    .channel("admin-subscriptions")

    .on(

      "postgres_changes",

      {

        event:"*",

        schema:"public",

        table:"subscriptions"

      },

      ()=>{

        loadSubscriptions();

      }

    )

    .subscribe();





    return ()=>{

      supabase.removeChannel(channel);

    };


  },[]);







  async function loadSubscriptions(){


    try{


      setLoading(true);



      const {

        data,

        error

      } = await supabase

      .from("subscriptions")

      .select(`

        id,

        user_id,

        acres,

        amount,

        status,

        start_date,

        created_at

      `)

      .order(

        "created_at",

        {
          ascending:false
        }

      );





      if(error)
        throw error;







      const updated = await Promise.all(

        (data || []).map(async(sub)=>{


          const {

            data:profile

          } = await supabase

          .from("profiles")

          .select(`

            name,

            phone

          `)

          .eq(

            "auth_user_id",

            sub.user_id

          )

          .maybeSingle();





          return {

            ...sub,

            name:

            profile?.name ||

            "Kisan",



            phone:

            profile?.phone ||

            "-"


          };


        })

      );





      setSubscriptions(updated);



    }

    catch(err){

      console.log(err.message);

    }

    finally{

      setLoading(false);

    }


  }







  if(loading){

    return (

      <h3>
        Loading Subscriptions...
      </h3>

    );

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
        👑 Subscription Management
      </h2>






      {
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

            padding:15,

            marginTop:15,

            borderRadius:10

          }}

          >



            <h3>
              👨‍🌾 {sub.name}
            </h3>



            <p>
              📱 Mobile:
              {" "}
              {sub.phone}
            </p>



            <p>
              🌾 Subscription Acre:
              {" "}
              {sub.acres || 0}
            </p>



            <p>
              💰 Amount:
              {" "}
              ₹{sub.amount || 0}
            </p>



            <p>
              📅 Start Date:
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
