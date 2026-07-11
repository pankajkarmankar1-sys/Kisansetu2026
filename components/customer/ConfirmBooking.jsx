import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function ConfirmBooking({
  bookingData,
  onConfirm,
  back,
}) {


  const [loading,setLoading] = useState(false);

  const [amount,setAmount] = useState(0);

  const [servicePrice,setServicePrice] = useState(0);

  const [normalTotal,setNormalTotal] = useState(0);

  const [discount,setDiscount] = useState(0);

  const [isSubscriber,setIsSubscriber] = useState(false);



  useEffect(()=>{

    calculateAmount();

  },[bookingData]);







  async function calculateAmount(){


    try{


      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();




      if(!user)
        return 0;






      const {
        data:subscription
      } = await supabase

      .from("subscriptions")

      .select("*")

      .eq(
        "user_id",
        user.id
      )

      .in(
        "status",
        [
          "active",
          "Active"
        ]
      )

      .maybeSingle();







      const subscriber =
      !!subscription;





      setIsSubscriber(subscriber);






      const normalPrice = 1100;



      const price = subscriber

      ?

      (
        subscription?.rate_per_acre || 550
      )

      :

      normalPrice;







      const acres =
      Number(
        bookingData?.acres || 0
      );






      const normalAmount =
      normalPrice * acres;






      const finalAmount =
      price * acres;






      setServicePrice(price);

      setNormalTotal(normalAmount);

      setDiscount(
        normalAmount-finalAmount
      );

      setAmount(finalAmount);





      return finalAmount;



    }
    catch(err){

      console.log(err);

      return 0;

    }


  }









  async function handleConfirm(){


    try{


      setLoading(true);





      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();





      const finalAmount =
      await calculateAmount();








      const farm =
      bookingData?.selKhet;







      const booking = {


        customer_id:user.id,


        customer_name:
        user.user_metadata?.name ||
        "Kisan",



        customer_phone:
        user.phone || "",





        farm_id:
        farm?.id || null,



        farm_name:
        farm?.name || "",



        village:
        farm?.village || "",



        farm_address:
        farm?.farm_address || "",



        district:
        farm?.district || "",



        taluka:
        farm?.taluka || "",






        service_name:

        bookingData?.selectedService?.name_hi ||
        bookingData?.selectedService?.name ||
        "",





        acres:
        Number(
          bookingData?.acres || 0
        ),






        amount:
        finalAmount,



        total_amount:
        finalAmount,



        payment_status:
        "Pending",



        status:
        "Pending",




        note:
        bookingData?.note || "",



        booking_date:
        bookingData?.date || null,


      };








      const {
        data,
        error

      } = await supabase

      .from("bookings")

      .insert([
        booking
      ])

      .select()

      .single();






      if(error)
        throw error;







      alert(
        "✅ Booking Successful"
      );





      if(onConfirm){

        onConfirm(data);

      }




    }
    catch(err){

      console.log(err);

      alert(err.message);

    }
    finally{

      setLoading(false);

    }


  }








  return (

    <div
      style={{
        padding:20,
        background:"#F8FAFC",
        minHeight:"100vh"
      }}
    >


      <button onClick={back}>
        ← Back
      </button>



      <h2>
        ✅ Confirm Booking
      </h2>






      <div
      style={{
        background:"#fff",
        padding:15,
        borderRadius:12
      }}
      >



        <p>
          🚜 Service:
          {" "}
          {bookingData?.selectedService?.name_hi ||
          bookingData?.selectedService?.name ||
          "-"
          }
        </p>





        <p>
          🌾 Acres:
          {" "}
          {bookingData?.acres || 0}
        </p>





        <p>
          📍 Farm:
          {" "}
          {bookingData?.selKhet?.name || "-"}
        </p>





        <p>
          💰 Rate:
          ₹{servicePrice}/Acre
        </p>





        <p>
          👑 Subscription:
          {" "}
          {
          isSubscriber
          ?
          "✅ Active"
          :
          "❌ Not Active"
          }
        </p>





        <h2>
          Pay ₹{amount}
        </h2>



      </div>






      <button

        onClick={handleConfirm}

        disabled={loading}

        style={{

          marginTop:20,

          width:"100%",

          padding:15,

          background:"#16a34a",

          color:"#fff",

          border:"none",

          borderRadius:12

        }}

      >

        {
        loading
        ?
        "Booking..."
        :
        "✅ Confirm Booking"
        }


      </button>



    </div>

  );

}
