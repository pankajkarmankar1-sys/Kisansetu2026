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
        🎉 Booking Confirmed
      </h1>



      <p>
        Aapki service booking successfully create ho gayi hai.
      </p>





      <div
        style={{
          background:"#fff",
          padding:20,
          borderRadius:12,
          marginTop:20,
          textAlign:"left",
          boxShadow:"0 2px 8px #ddd"
        }}
      >



        <p>
          🚜 <b>Service:</b>
          {" "}
          {
          bookingData?.service_name ||
          bookingData?.selectedService?.name_hi ||
          bookingData?.selectedService?.name ||
          "-"
          }
        </p>





        <p>
          🌾 <b>Acres:</b>
          {" "}
          {
          bookingData?.acres || 0
          }
        </p>





        <p>
          💰 <b>Total Amount:</b>
          {" "}
          ₹
          {
          bookingData?.amount ||
          bookingData?.total_amount ||
          0
          }
        </p>





        <p>
          📅 <b>Booking Date:</b>
          {" "}
          {
          bookingData?.booking_date ||
          bookingData?.date ||
          "-"
          }
        </p>





        <p>
          👤 <b>Customer:</b>
          {" "}
          {
          bookingData?.customer_name ||
          "Kisan"
          }
        </p>





        <p>
          📞 <b>Mobile:</b>
          {" "}
          {
          bookingData?.customer_phone ||
          "-"
          }
        </p>





        <p>
          📍 <b>Village:</b>
          {" "}
          {
          bookingData?.village ||
          bookingData?.state ||
          "-"
          }
        </p>





        <p>
          💳 <b>Payment Status:</b>
          {" "}
          {
          bookingData?.payment_status ||
          "Pending"
          }
        </p>





        <p>
          📌 <b>Status:</b>
          {" "}
          {
          bookingData?.status ||
          "Pending"
          }
        </p>



      </div>





      <button

        onClick={onDone}

        style={{
          marginTop:20,
          width:"100%",
          padding:14,
          background:"#16a34a",
          color:"#fff",
          border:"none",
          borderRadius:10,
          fontSize:18
        }}

      >

        🏠 Go Home

      </button>




    </div>

  );

}
