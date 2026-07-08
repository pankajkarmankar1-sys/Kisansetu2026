// components/tracking/CustomerMap.jsx

import React from "react";


export default function CustomerMap({

  booking,

  driverLocation,

}) {


  return (

    <div

      style={{

        background:"#fff",

        border:"1px solid #ddd",

        borderRadius:12,

        padding:20,

        marginTop:15,

      }}

    >


      <h3>
        🗺️ Live Tractor Map
      </h3>



      <div

        style={{

          height:300,

          borderRadius:10,

          background:"#e8f5e9",

          display:"flex",

          justifyContent:"center",

          alignItems:"center",

          fontSize:18,

          fontWeight:"bold",

          color:"#16a34a",

        }}

      >

        🚜 Driver Tracking Map


      </div>




      <div

        style={{

          marginTop:15,

        }}

      >


        <p>

          <b>
            Driver Latitude:
          </b>

          {" "}

          {
            driverLocation?.lat ??
            "Waiting..."
          }

        </p>



        <p>

          <b>
            Driver Longitude:
          </b>

          {" "}

          {
            driverLocation?.lng ??
            "Waiting..."
          }

        </p>



        <p>

          <b>
            Booking ID:
          </b>

          {" "}

          {
            booking?.id ||
            "-"
          }

        </p>


      </div>


    </div>

  );

}
