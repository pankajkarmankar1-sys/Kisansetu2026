// components/maps/DriverMarker.jsx

import React from "react";


export default function DriverMarker({

  driver

}) {


  if (!driver) return null;



  return (

    <div

      style={{

        background:"#2563eb",

        color:"#fff",

        padding:"12px",

        borderRadius:"12px",

        margin:"10px",

        textAlign:"center",

        fontWeight:"bold",

        boxShadow:
        "0 3px 8px rgba(0,0,0,0.2)",

      }}

    >

      🚜 Driver Location


      <br />


      👨‍🌾
      {
        driver.name ||
        "Driver"
      }


      <br />


      📍 Lat:
      {
        driver.lat || "N/A"
      }


      <br />


      📍 Lng:
      {
        driver.lng || "N/A"
      }


    </div>

  );

}
