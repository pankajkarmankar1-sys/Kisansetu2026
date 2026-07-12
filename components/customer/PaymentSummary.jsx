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


  const [subscription,setSubscription] = useState(null);

  const [showPayment,setShowPayment] = useState(false);



  useEffect(()=>{

    checkSubscription();

  },[]);




  async function checkSubscription(){


    if(!user?.id)
      return;



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



    setSubscription(data || null);


  }






  const isSubscriber =
  !!subscription;



  const normalPrice =
  Number(
    selectedService?.price || 0
  );



  const subscriberPrice =
  Number(
    selectedService?.price_subscriber || 0
  );



  const payRate =

  isSubscriber

  ?

  subscriberPrice

  :

  normalPrice;





  const acresValue =
  Number(acres || 0);




  const normalAmount =
  normalPrice *
  acresValue;




  const finalAmount =
  payRate *
  acresValue;




  const discount =
  normalAmount -
  finalAmount;








  if(showPayment && !paymentDone){


    return (

      <PhonePePayment

        amount={finalAmount}

        onSuccess={()=>{

          setPaymentDone(true);

          setShowPayment(false);

        }}

        onBack={()=>{

          setShowPayment(false);

        }}

      />

    );

  }







  return (

    <div className="min-h-screen bg-green-50 p-5">


      <div className="bg-white rounded-3xl shadow p-6">


        <button

          onClick={back}

          className="bg-gray-200 px-4 py-2 rounded-xl"

        >

          ← Back

        </button>





        <h1 className="text-2xl font-bold text-green-700 mt-5">

          💳 Payment Summary

        </h1>







        <div className="bg-green-100 rounded-2xl p-5 mt-5">


          <p className="font-bold">

            🚜 Service

          </p>


          <h3>

            {selectedService?.name_hi ||
             selectedService?.name ||
             "-"}

          </h3>





          <p className="mt-3">

            🌾 Acres:

            {" "}

            {acresValue}

          </p>





          <p>

            👑 Plan:

            {" "}

            {isSubscriber

            ?

            "Subscription Active"

            :

            "Normal Customer"

            }

          </p>


        </div>







        <div className="bg-white border rounded-2xl p-5 mt-5">


          <p>

            Normal Rate:

            {" "}

            ₹{normalPrice}/Acre

          </p>





          {
            isSubscriber &&

            <p className="text-green-600 font-bold">

              🎉 50% Discount Applied

              <br/>

              Saved ₹{discount}

            </p>

          }






          <p>

            Pay Rate:

            {" "}

            ₹{payRate}/Acre

          </p>





          <h2 className="text-3xl font-bold mt-4">

            Total ₹{finalAmount}

          </h2>



        </div>







        {
          !paymentDone

          ?

          <button

            onClick={()=>setShowPayment(true)}

            className="w-full bg-green-600 text-white p-4 rounded-2xl mt-5 font-bold"

          >

            💳 Pay Now

          </button>


          :

          <button

            onClick={next}

            className="w-full bg-green-600 text-white p-4 rounded-2xl mt-5 font-bold"

          >

            Continue →

          </button>

        }



      </div>


    </div>

  );


}
