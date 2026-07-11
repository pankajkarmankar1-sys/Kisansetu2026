import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import PhonePePayment from "../payment/PhonePePayment";


export default function PaymentSummary({
  user,
  selectedService,
  acres,
  paymentDone,
  setPaymentDone,
  next,
  back,
}) {


  const [isSubscriber,setIsSubscriber] = useState(false);
  const [showPayment,setShowPayment] = useState(false);



  useEffect(()=>{

    checkSubscription();

  },[]);





  async function checkSubscription(){

    try{


      if(!user?.id)
        return;



      const today =
      new Date()
      .toISOString();




      const {
        data,
        error
      } = await supabase

      .from("subscriptions")

      .select("id")

      .eq(
        "user_id",
        user.id
      )

      .eq(
        "status",
        "active"
      )

      .gte(
        "end_date",
        today
      )

      .maybeSingle();





      if(error){

        console.log(error);

        return;

      }




      setIsSubscriber(
        !!data
      );


    }
    catch(err){

      console.log(err);

    }

  }






  const normalPrice =
  Number(
    selectedService?.price || 0
  );





  const price =
  isSubscriber
  ?
  normalPrice * 0.5
  :
  normalPrice;





  const acresValue =
  Number(acres || 0);





  const normalAmount =
  normalPrice *
  acresValue;





  const amount =
  price *
  acresValue;





  const discount =
  normalAmount -
  amount;







  if(showPayment && !paymentDone){


    return (

      <PhonePePayment

        amount={amount}

        onSuccess={()=>{

          setPaymentDone(true);

          setShowPayment(false);

        }}

        onBack={()=>
          setShowPayment(false)
        }

      />

    );

  }







  return (

    <div
      style={{
        padding:20,
        background:"#F8FAFC",
        minHeight:"100vh",
      }}
    >


      <button onClick={back}>
        ← Back
      </button>




      <h2>
        💳 Payment Summary
      </h2>




      <div
        style={{
          background:"#fff",
          padding:15,
          borderRadius:12,
        }}
      >



        <p>
          🚜 Service:
          {" "}
          {
          selectedService?.name_hi ||
          selectedService?.name ||
          "-"
          }
        </p>




        <p>
          🌾 Acres:
          {" "}
          {acresValue}
        </p>





        <p>
          👑 Plan:
          {" "}
          {
          isSubscriber
          ?
          "Subscriber"
          :
          "Normal"
          }
        </p>





        <p>
          💰 Normal Rate:
          ₹{normalPrice}/Acre
        </p>





        {
          isSubscriber &&

          <p>
            🎉 50% Discount:
            ₹{discount}
          </p>

        }





        <p>
          Pay Rate:
          ₹{price}/Acre
        </p>





        <h2>
          Total: ₹{amount}
        </h2>





        <p>
          Status:
          {" "}
          {
          paymentDone
          ?
          "✅ Paid"
          :
          "⏳ Pending"
          }
        </p>



      </div>







      {
      !paymentDone

      ?

      <button

        onClick={()=>
          setShowPayment(true)
        }

        style={{
          marginTop:20,
          padding:12,
          width:"100%",
          background:"#16a34a",
          color:"#fff",
          border:"none",
          borderRadius:10,
        }}

      >

        💳 Pay Now

      </button>


      :


      <button

        onClick={next}

        style={{
          marginTop:20,
          padding:12,
          width:"100%",
        }}

      >

        Continue →

      </button>

      }



    </div>

  );


}
