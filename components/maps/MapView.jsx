// components/maps/MapView.jsx

import React from "react";


export default function MapView({

  children,

  height = 400,

}) {


  return (

    <div

      style={{

        height,

        width: "100%",

        borderRadius: 12,

        border: "1px solid #ddd",

        background: "#eef7ee",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        position: "relative",

        overflow: "hidden",

      }}

    >


      <div

        style={{

          position: "absolute",

          top: 10,

          left: 10,

          fontWeight: "bold",

          zIndex: 2,

        }}

      >

        🗺️ KisanSetu Map

      </div>



      {children}



    </div>

  );

}
