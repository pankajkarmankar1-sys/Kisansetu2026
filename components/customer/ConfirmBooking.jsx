import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ConfirmBooking({
  bookingData,
  onConfirm,
  back,
}) {
  const [loading, setLoading] = useState(false);

  const amount =
    (bookingData?.selectedService?.normalPrice || 0) *
    Number(bookingData?.acres || 0);

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first");
        return;
      }


      const booking = {
        customer_id: user.id,

        service_name:
          bookingData?.selectedService?.name || "",

        service_id:
          bookingData?.selectedService?.id || null,

        acres:
          Number(bookingData?.acres || 0),

        booking_date:
          bookingData?.date || null,

        amount: amount,

        payment_status:
          bookingData?.payment_status || "Pending",

        status:
          "Pending",

        note:
          bookingData?.note || "",

        farm_location:
          bookingData?.selKhet || null,

        created_at:
          new Date().toISOString(),
      };


      const { data, error } = await supabase
        .from("bookings")
        .insert([booking])
        .select()
        .single();


      if (error) {
        throw error;
      }


      console.log("Booking Created:", data);


      alert("✅ Booking Successful");


      if (onConfirm) {
        onConfirm(data);
      }


    } catch (err) {

      console.error(
        "Booking Error:",
        err
      );

      alert(err.message);

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
          {bookingData?.selectedService?.name}
        </p>


        <p>
          🌾 Acres:
          {" "}
          {bookingData?.acres}
        </p>


        <p>
          📅 Date:
          {" "}
          {bookingData?.date}
        </p>


        <p>
          💰 Amount:
          {" "}
          ₹{amount}
        </p>


        <p>
          💳 Payment:
          {" "}
          {bookingData?.payment_status}
        </p>


        <p>
          📍 Farm:
          {" "}
          {bookingData?.selKhet || "-"}
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
