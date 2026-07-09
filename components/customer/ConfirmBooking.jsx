import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ConfirmBooking({
  bookingData,
  onConfirm,
  back,
}) {

  const [loading, setLoading] = useState(false);


  const [amount, setAmount] = useState(0);

React.useEffect(() => {
  async function calculateAmount() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_phone", user.phone)
      .eq("status", "Active")
      .gte(
        "expiry_date",
        new Date().toISOString().split("T")[0]
      )
      .maybeSingle();

    const price = subscription
      ? Number(
          bookingData?.selectedService?.price_subscriber || 0
        )
      : Number(
          bookingData?.selectedService?.price || 0
        );

    setAmount(
      price *
        Number(bookingData?.acres || 0)
    );
  }

  calculateAmount();
}, [bookingData]);



  const handleConfirm = async () => {

    try {

      setLoading(true);


      const {
        data: { user },
      } = await supabase.auth.getUser();



      if (!user) {

        alert("Please login first");

        setLoading(false);

        return;

      }



      const booking = {

        customer_id:
          user.id,


        service_name:
          bookingData?.selectedService?.name_hi ||
          bookingData?.selectedService?.name ||
          "",


        service_id:
          bookingData?.selectedService?.service_id ||
          null,


        acres:
          Number(
            bookingData?.acres || 0
          ),


        amount,


        total_amount:
          amount,


        payment_status:
          bookingData?.payment_status ||
          "Pending",


        status:
          "Pending",


        note:
          bookingData?.note ||
          null,

      };



      const { data, error } =
        await supabase
          .from("bookings")
          .insert([booking])
          .select()
          .single();



      if (error) {

        throw error;

      }



      await supabase
        .from("notifications")
        .insert([
          {

            user_id:
              user.id,


            title:
              "✅ Booking Created",


            message:
              `${booking.service_name} booking created successfully`,


          },
        ]);



      alert("✅ Booking Successful");



      if (onConfirm) {

        onConfirm(data);

      }



    } catch (err) {


      console.error(
        "Booking Error:",
        err
      );


      alert(
        err.message
      );


    } finally {


      setLoading(false);


    }

  };




  return (

    <div
      style={{
        background:"#F8FAFC",
        minHeight:"100vh",
        padding:20,
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
          borderRadius:12,
          marginTop:20,
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
          {bookingData?.acres || 0}
        </p>



        <p>
          💰 Amount:
          {" "}
          ₹{amount}
        </p>



        <p>
          💳 Payment:
          {" "}
          {bookingData?.payment_status || "Pending"}
        </p>



        <p>
          📝 Note:
          {" "}
          {bookingData?.note || "-"}
        </p>


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
          fontWeight:"bold",
        }}

      >

        {
          loading
          ? "Booking..."
          : "✅ Confirm Booking"
        }


      </button>



    </div>

  );

}
