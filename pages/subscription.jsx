import React, { useState } from "react";
import { useRouter } from "next/router";
import PhonePePayment from "../components/payment/PhonePePayment";
import { supabase } from "../lib/supabase";


export default function SubscriptionPage(){


  const router = useRouter();


  const [acres,setAcres] = useState("");

  const [payment,setPayment] = useState(false);



  const pricePerAcre = 550;


  const amount =
    Number(acres || 0) * pricePerAcre;





  async function paymentSuccess(){


    try{


      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();



      if(!user){

        router.replace("/login");

        return;

      }




      const startDate = new Date();



      const endDate = new Date();

      endDate.setFullYear(
        endDate.getFullYear()+1
      );






      const {
        error
      } = await supabase

      .from("subscriptions")

      .insert({

        user_id:user.id,

        acres:Number(acres),

        amount:amount,

        status:"active",

        start_date:startDate,

        end_date:endDate,

      });





      if(error)
        throw error;




      alert(
        "✅ Subscription Activated"
      );



      router.replace("/dashboard");



    }
    catch(err){

      console.log(err);

      alert(
        err.message
      );

    }


  }






  if(payment){


    return (

      <PhonePePayment

        amount={amount}

        onSuccess={paymentSuccess}

        onBack={()=>
          setPayment(false)
        }

      />

    );


  }







  return (

    <div
      style={{
        padding:20,
        background:"#f5f7fb",
        minHeight:"100vh"
      }}
    >


      <button
      onClick={()=>router.back()}
      >
        ← Back
      </button>



      <h2>
        👑 KisanSetu Subscription
      </h2>



      <h3>
        ₹550 / Acre / Year
      </h3>




      <input

      type="number"

      placeholder="Enter Farm Acres"

      value={acres}

      onChange={(e)=>
        setAcres(e.target.value)
      }

      style={{
        width:"100%",
        padding:12
      }}

      />





      <h2>
        Pay ₹{amount}
      </h2>




      <button

      onClick={()=>{

        if(!acres){

          alert("Enter acres");

          return;

        }

        setPayment(true);

      }}

      style={{

        width:"100%",

        padding:15,

        background:"#f59e0b",

        color:"#fff",

        border:"none",

        borderRadius:10,

        fontSize:18

      }}

      >

        👑 Buy Subscription

      </button>



    </div>

  );


}
