import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function ConfirmBooking({
  bookingData,
  onConfirm,
  back,
}) {


  const [loading,setLoading] = useState(false);

  const [amount,setAmount] = useState(0);

  const [rate,setRate] = useState(0);



  useEffect(()=>{

    calculateAmount();

  },[bookingData]);





  async function calculateAmount(){

    try{


      const service =
      bookingData?.selectedService;



      const price =
      Number(
        service?.selected_price ||
        service?.price ||
        0
      );



      const acres =
      Number(
        bookingData?.acres || 0
      );



      const total =
      price * acres;



      setRate(price);

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

        alert("Login required");

        return;

      }





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



        farm_address:
        farm?.farm_address || "",



        village:
        farm?.village || "",



        state:
        farm?.state || "Maharashtra",



        district:
        farm?.district || "",



        taluka:
        farm?.taluka || "",



        farm_lat:
        farm?.latitude || null,



        farm_lng:
        farm?.longitude || null,



        service_name:

        bookingData?.selectedService?.name_hi ||

        bookingData?.selectedService?.name ||

        "",



        acres:

        Number(
          bookingData?.acres || 0
        ),



        farm_acres:

        Number(
          farm?.acres || 0
        ),



        amount:
        finalAmount,



        total_amount:
        finalAmount,



        payment_status:
        bookingData?.payment_status ||
        "Paid",



        status:
        "Pending",



        booking_status:
        "Pending",



        work_status:
        "Pending",



        booking_date:
        bookingData?.date || null,



        note:
        bookingData?.note || "",



        document_verified:
        false,



        otp_verified:
        false,


      };





      const {
        data,
        error
      } = await supabase

      .from("bookings")

      .insert(booking)

      .select()

      .single();





      if(error)
        throw error;





      alert(
        "✅ Booking Confirmed"
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

    <div className="min-h-screen bg-green-50 p-5">


      <div className="bg-white rounded-3xl shadow p-6">


        <button
          onClick={back}
          className="bg-gray-200 px-4 py-2 rounded-xl"
        >
          ← Back
        </button>



        <h1 className="text-2xl font-bold text-green-700 mt-5">
          ✅ Confirm Booking
        </h1>




        <div className="bg-green-100 rounded-2xl p-5 mt-5">


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
            {bookingData?.acres || 0}
          </p>



          <p>
            📍 Farm:
            {" "}
            {bookingData?.selKhet?.name || "-"}
          </p>



          <p>
            📅 Date:
            {" "}
            {bookingData?.date || "-"}
          </p>



          <p>
            💰 Rate:
            ₹{rate}/Acre
          </p>



          <h2 className="text-3xl font-bold mt-4">
            Pay ₹{amount}
          </h2>


        </div>





        <button

          onClick={handleConfirm}

          disabled={loading}

          className="w-full bg-green-600 text-white p-4 rounded-2xl mt-6 font-bold"

        >

          {
          loading
          ?
          "Creating..."
          :
          "🚜 Confirm Booking"
          }

        </button>



      </div>


    </div>

  );

}
