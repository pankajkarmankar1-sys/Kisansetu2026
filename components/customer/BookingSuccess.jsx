import React from "react";

export default function BookingSuccess({
  bookingData,
  onDone,
}) {

  return (

    <div
      style={{
        padding:20,
        textAlign:"center",
        background:"#F8FAFC",
        minHeight:"100vh",
      }}
    >


      <h1>
        🎉 Booking Successful
      </h1>



      <p>
        Aapki booking successfully create ho gayi hai.
      </p>



      <br />



      <div
        style={{
          background:"#fff",
          borderRadius:10,
          padding:15,
          marginBottom:20,
          textAlign:"left",
        }}
      >



        <p>

          <b>🚜 Service:</b>
          {" "}

          {
          bookingData?.selectedService?.name_hi ||
          bookingData?.selectedService?.name ||
          "-"
          }

        </p>





        <p>

          <b>🌾 Acres:</b>
          {" "}

          {
          bookingData?.acres || 0
          }

        </p>





        <p>

          <b>💰 Amount:</b>
          {" "}

          ₹
          {
          bookingData?.amount || 
          bookingData?.total_amount ||
          0
          }

        </p>





        <p>

          <b>📅 Date:</b>
          {" "}

          {
          bookingData?.date || "-"
          }

        </p>





        <p>

          <b>💳 Payment:</b>
          {" "}

          {
          bookingData?.payment_status ||
          "Pending"
          }

        </p>





        <p>

          <b>📍 Village:</b>
          {" "}

          {
          bookingData?.selKhet?.selected712?.village ||
          bookingData?.selKhet?.village ||
          "-"
          }

        </p>



      </div>





      <button

        onClick={onDone}

        style={{
          padding:12,
          width:"100%",
          borderRadius:8,
          border:"none",
          background:"#16a34a",
          color:"#fff",
          fontSize:16,
        }}

      >

        🏠 Home

      </button>




    </div>

  );

}
