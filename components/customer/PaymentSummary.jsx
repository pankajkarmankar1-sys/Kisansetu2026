import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PaymentSummary({
  user,
  selectedService,
  acres,
  paymentDone,
  setPaymentDone,
  next,
  back,
}) {

  const [isSubscriber, setIsSubscriber] = useState(false);


  useEffect(() => {
    checkSubscription();
  }, []);



  async function checkSubscription() {

    try {

      if (!user?.id) return;


      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();


      if (!error && data) {
        setIsSubscriber(true);
      }


    } catch (err) {

      console.log(err);

    }

  }




  const price =
    isSubscriber
      ? Number(selectedService?.price_subscriber || 0)
      : Number(selectedService?.price || 0);



  const amount =
    price * Number(acres || 0);




  return (

    <div
      style={{
        padding:20,
        background:"#F8FAFC",
        minHeight:"100vh",
      }}
    >


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
          {selectedService?.name_hi ||
          selectedService?.name ||
          "-"}
        </p>



        <p>
          🌾 Acres:
          {" "}
          {acres || 0}
        </p>



        <p>
          👑 Plan:
          {" "}
          {isSubscriber
            ? "Subscriber"
            : "Normal"}
        </p>



        <p>
          💰 Rate:
          {" "}
          ₹{price} / Acre
        </p>



        <h2>
          Total:
          {" "}
          ₹{amount}
        </h2>



        <p>
          Status:
          {" "}
          {paymentDone
          ? "✅ Paid"
          : "⏳ Pending"}
        </p>


      </div>




      {!paymentDone ? (

        <button
          onClick={() => setPaymentDone(true)}
          style={{
            marginTop:20,
            padding:12,
            width:"100%",
          }}
        >
          💳 Pay Now
        </button>

      ) : (

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

      )}




      <button
        onClick={back}
        style={{
          marginTop:15,
          padding:12,
          width:"100%",
        }}
      >
        ← Back
      </button>


    </div>

  );

}
