// components/maps/FarmMarker.jsx

import React from "react";


export default function FarmMarker({

  farm

}) {


  if (!farm) return null;



  return (

    <div

      style={{

        background:"#16a34a",

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

      🌾 Farm Location


      <br />


      📍 Lat:
      {
        farm.lat || "N/A"
      }


      <br />


      📍 Lng:
      {
        farm.lng || "N/A"
      }


    </div>

  );

}
