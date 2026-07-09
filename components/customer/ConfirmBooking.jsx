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



      if(!user) return 0;



      const {
        data:subscription
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




      const subscriber =
        !!subscription;



      setIsSubscriber(
        subscriber
      );




      const price =
        subscriber
        ?
        Number(
          bookingData?.selectedService?.price_subscriber || 0
        )
        :
        Number(
          bookingData?.selectedService?.price || 0
        );



      setServicePrice(price);




      const total =
        price *
        Number(
          bookingData?.acres || 0
        );



      setAmount(total);



      return total;


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




      if(!user){

        alert("Please login first");

        return;

      }





      // Document approval check

      const {
        data:profile
      } = await supabase
        .from("profiles")
        .select("document_status")
        .eq(
          "auth_user_id",
          user.id
        )
        .maybeSingle();





      if(
        !profile ||
        profile.document_status !== "approved"
      ){

        alert(
          "Please complete document verification first"
        );

        return;

      }






      const finalAmount =
        await calculateAmount();






      const booking = {


        customer_id:
          user.id,



        customer_name:
          user.user_metadata?.name ||
          "Kisan",



        customer_phone:
          user.phone || "",





        farm_name:
          bookingData?.selKhet?.name ||
          "",



        state:
          bookingData?.selKhet?.state ||
          "",



        district:
          bookingData?.selKhet?.district ||
          "",



        taluka:
          bookingData?.selKhet?.taluka ||
          "",



        village:
          bookingData?.selKhet?.village ||
          "",




        survey_no:
          bookingData?.selKhet?.surveyNo ||
          "",




        farm_acres:
          Number(
            bookingData?.selKhet?.acres || 0
          ),




        farm_lat:
          bookingData?.selKhet?.location?.lat ||
          null,



        farm_lng:
          bookingData?.selKhet?.location?.lng ||
          null,




        booking_date:
          bookingData?.date ||
          null,





        service_id:
          bookingData?.selectedService?.service_id ||
          null,





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
          bookingData?.payment_status ||
          "Pending",



        status:
          "Pending",



        note:
          bookingData?.note ||
          null,



        document_verified:
          true,


      };





      const {
        data,
        error
      } =
      await supabase
        .from("bookings")
        .insert([
          booking
        ])
        .select()
        .single();



      if(error)
        throw error;





      await supabase
        .from("notifications")
        .insert([{

          user_id:user.id,


          title:
            "✅ Booking Created",


          message:
            `${booking.service_name} booking created successfully`

        }]);
      alert(
        "✅ Booking Successful"
      );



      if(onConfirm){

        onConfirm(data);

      }




    }
    catch(err){


      console.error(err);


      alert(
        err.message
      );


    }
    finally{


      setLoading(false);


    }


  }






  return (

    <div

      style={{

        background:"#F8FAFC",

        minHeight:"100vh",

        padding:20

      }}

    >



      <button

        onClick={back}

      >

        ← Back

      </button>





      <h2>

        ✅ Confirm Booking

      </h2>






      <div

        style={{

          background:"#fff",

          padding:15,

          borderRadius:12,

          marginTop:20

        }}

      >




        <p>

          🚜 Service:

          {" "}

          {

          bookingData?.selectedService?.name_hi ||

          bookingData?.selectedService?.name ||

          "-"

          }

        </p>





        <p>

          🌾 Acres:

          {" "}

          {

          bookingData?.acres || 0

          }

        </p>





        <p>

          💵 Rate:

          {" "}

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

          💰 Total:

          {" "}

          ₹{amount}

        </h2>





      </div>






      <button


        onClick={handleConfirm}


        disabled={loading}



        style={{


          marginTop:20,


          width:"100%",


          padding:15,


          border:"none",


          borderRadius:12,


          background:"#16a34a",


          color:"#fff",


          fontSize:18,


          fontWeight:"bold"


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
