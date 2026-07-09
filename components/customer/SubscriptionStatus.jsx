import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function SubscriptionStatus({
  user,
}) {


  const [subscription,setSubscription] = useState(null);
  const [loading,setLoading] = useState(true);




  useEffect(()=>{

    checkSubscription();

  },[user]);





  async function checkSubscription(){


    try{


      if(!user?.id){

        setLoading(false);

        return;

      }




      const {

        data

      } = await supabase

      .from("subscriptions")

      .select("*")

      .eq(

        "user_id",

        user.id

      )

      .eq(

        "status",

        "active"

      )

      .maybeSingle();





      setSubscription(data);



    }

    catch(err){


      console.log(err);


    }

    finally{


      setLoading(false);


    }


  }







  if(loading){


    return (

      <div

        style={{

          marginTop:20,

          padding:15,

          background:"#fff",

          borderRadius:12,

        }}

      >

        Loading subscription...

      </div>

    );

  }






  return (

    <div

      style={{

        marginTop:20,

        padding:20,

        background:"#fff",

        borderRadius:12,

      }}

    >



      <h2>
        👑 Subscription
      </h2>




      {
        subscription

        ?

        (

          <>

          <p>
            Status: ✅ Active
          </p>


          <p>
            Plan: {subscription.plan_name}
          </p>


          <p>
            Amount: ₹{subscription.amount}
          </p>


          <p>
            Expiry:

            {" "}

            {
            subscription.end_date
            ?

            new Date(
              subscription.end_date
            ).toLocaleDateString()

            :

            "-"
            }

          </p>


          </>

        )


        :


        (

          <p>
            ❌ No Active Subscription
          </p>

        )

      }




    </div>

  );

}
