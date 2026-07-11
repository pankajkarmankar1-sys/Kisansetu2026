import React, { useState } from "react";
import { useRouter } from "next/router";
import PhonePePayment from "../components/payment/PhonePePayment";
import SubscriptionPlans from "../components/customer/SubscriptionPlans";
import { supabase } from "../lib/supabase";


export default function SubscriptionPage(){


  const router = useRouter();


  const [plan,setPlan] = useState(null);

  const [payment,setPayment] = useState(false);




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




      const startDate =
      new Date();



      const endDate =
      new Date();


      endDate.setFullYear(
        endDate.getFullYear()+1
      );






      const {
        error
      } = await supabase

      .from("subscriptions")

      .insert({

        user_id:user.id,

        acres:
        plan.acres,

        amount:
        plan.price,

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







  if(payment && plan){


    return (

      <PhonePePayment

        amount={plan.price}

        onSuccess={paymentSuccess}

        onBack={()=>
          setPayment(false)
        }

      />

    );

  }







  return (

    <SubscriptionPlans


      onSelect={(selected)=>{


        setPlan(selected);


        setPayment(true);


      }}



      back={()=>router.back()}


    />

  );


}
