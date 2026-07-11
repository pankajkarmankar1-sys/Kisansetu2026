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
        id,
        user_id,
        acres,
        amount,
        status,
        start_date
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

            padding:15,

            marginTop:10,

            borderRadius:10

          }}

          >


            <h3>
              👨‍🌾 {sub.name}
            </h3>



            <p>
              📱 {sub.phone}
            </p>




            <p>
              🌾 Land:
              {" "}
              {sub.acres} Acre
            </p>




            <p>
              💰 Paid:
              {" "}
              ₹{sub.amount}
            </p>




            <p>
              📅 Start:
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
