import React, { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function SubscriptionPayment({
  user,
  onSuccess,
  onBack,
}) {


  const [acres,setAcres] = useState("");

  const [loading,setLoading] = useState(false);



  const pricePerAcre = 550;


  const amount =
    Number(acres || 0) * pricePerAcre;





  async function startSubscription(){


    try{


      if(!acres){

        alert("Please enter acres");

        return;

      }



      setLoading(true);



      /*
        Abhi testing payment flow hai.
        Real PhonePe gateway baad me connect karenge.
      */


      setTimeout(async ()=>{


        const {
          error
        } = await supabase

        .from("subscriptions")

        .insert([{

          user_id:user.id,

          acres:Number(acres),

          amount:amount,

          status:"active",

          end_date:
          new Date(
            new Date().setFullYear(
              new Date().getFullYear()+1
            )
          )

        }]);




        if(error){

          console.log(error);

          alert(
            error.message
          );

          return;

        }




        alert(
          "✅ Subscription Activated"
        );



        if(onSuccess){

          onSuccess();

        }



        setLoading(false);



      },2000);



    }
    catch(err){


      console.log(err);


      setLoading(false);


    }


  }







  return (

    <div

      style={{

        padding:20,

        background:"#fff",

        borderRadius:12

      }}

    >


      <h2>
        👑 KisanSetu Subscription
      </h2>



      <h3>
        ₹550 / Acre / Year
      </h3>




      <label>
        Your Farm Acres
      </label>



      <input

        type="number"

        value={acres}

        onChange={(e)=>
          setAcres(e.target.value)
        }

        placeholder="Enter acres"

        style={{

          width:"100%",

          padding:12,

          marginTop:10

        }}

      />





      <h2>
        Pay ₹{amount}
      </h2>





      <button

        onClick={startSubscription}

        disabled={loading}

        style={{

          width:"100%",

          padding:15,

          background:"#16a34a",

          color:"#fff",

          border:"none",

          borderRadius:10,

          fontSize:18

        }}

      >

      {
        loading
        ?
        "Processing..."
        :
        "Pay Subscription"
      }


      </button>





      {
        onBack &&

        <button

          onClick={onBack}

          style={{

            width:"100%",

            padding:12,

            marginTop:10

          }}

        >

          ← Back

        </button>

      }





    </div>

  );

}
