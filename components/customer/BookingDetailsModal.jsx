
import React from "react";


export default function BookingDetailsModal({

  booking,
  onClose,

}) {


  if(!booking)

    return null;




  return (

    <div

      style={{

        position:"fixed",

        inset:0,

        background:"rgba(0,0,0,0.5)",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        zIndex:999

      }}

    >



      <div

        style={{

          background:"#fff",

          width:"90%",

          maxWidth:450,

          padding:20,

          borderRadius:20,

          maxHeight:"90vh",

          overflowY:"auto"

        }}

      >




        <h2 style={{color:"#15803d"}}>

          📋 Booking Details

        </h2>






        <p>

          🚜 <b>Service:</b>

          {" "}

          {booking.service_name || "-"}

        </p>





        <p>

          📅 <b>Date:</b>

          {" "}

          {booking.booking_date || "-"}

        </p>





        <p>

          🌾 <b>Acres:</b>

          {" "}

          {booking.acres || 0}

        </p>





        <p>

          💰 <b>Amount:</b>

          {" "}

          ₹{booking.amount || 0}

        </p>





        <p>

          💳 <b>Payment:</b>

          {" "}

          {booking.payment_status || "Pending"}

        </p>





        <p>

          📦 <b>Status:</b>

          {" "}

          {booking.status || "Pending"}

        </p>







        <hr/>







        <h3>

          🌾 Farm Details

        </h3>





        <p>

          🌱 <b>Farm:</b>

          {" "}

          {booking.farm_name || "-"}

        </p>





        <p>

          📍 <b>Village:</b>

          {" "}

          {booking.village || "-"}

        </p>





        <p>

          🏡 <b>Address:</b>

          {" "}

          {booking.farm_address || "-"}

        </p>






        <hr/>







        <h3>

          🚜 Driver Details

        </h3>





        <p>

          👨‍🔧 <b>Name:</b>

          {" "}

          {booking.driver_name || "Not Assigned"}

        </p>





        <p>

          📞 <b>Mobile:</b>

          {" "}

          {booking.driver_phone || "-"}

        </p>







        <button


          onClick={onClose}


          style={{

            width:"100%",

            padding:14,

            marginTop:15,

            background:"#dc2626",

            color:"#fff",

            border:"none",

            borderRadius:12,

            fontWeight:"bold"

          }}


        >

          Close

        </button>





      </div>



    </div>


  );


}
