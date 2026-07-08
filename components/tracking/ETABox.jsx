// components/tracking/ETABox.jsx

import React from "react";


export default function ETABox({

  booking,

  driverLocation,

}) {


  const distance =
    driverLocation
      ? "Calculating..."
      : "Waiting for driver";


  const eta =
    driverLocation
      ? "Calculating..."
      : "--";



  return (

    <div

      style={{

        background:"#fff",

        border:"1px solid #ddd",

        borderRadius:12,

        padding:20,

        marginBottom:15,

      }}

    >

      <h3>
        ⏱️ Arrival Information
      </h3>



      <p>
        🚜 Driver is on the way
      </p>



      <p>

        📍 Distance :

        {" "}

        <b>
          {distance}
        </b>

      </p>



      <p>

        ⏰ Estimated Arrival :

        {" "}

        <b>
          {eta}
        </b>

      </p>



      <p>

        📅 Booking :

        {" "}

        <b>
          {booking?.id || "-"}
        </b>

      </p>




      <div

        style={{

          marginTop:15,

          padding:10,

          background:"#e8f5e9",

          borderRadius:8,

        }}

      >

        <b>Status:</b>

        {" "}

        {
          booking?.booking_status ||
          booking?.status ||
          "On The Way"
        }


      </div>


    </div>

  );

}
