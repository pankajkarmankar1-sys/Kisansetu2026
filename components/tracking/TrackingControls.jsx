// components/tracking/TrackingControls.jsx

import React from "react";


export default function TrackingControls({

  booking,

  onStart,

  onPause,

  onStop,

  onRefresh,

}) {


  const button = (
    action,
    text,
    color
  ) => (

    <button

      onClick={action}

      style={{

        padding:12,

        background:color,

        color:"#fff",

        border:"none",

        borderRadius:8,

        cursor:"pointer",

        fontWeight:"bold",

      }}

    >

      {text}

    </button>

  );



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
        🎮 Tracking Controls
      </h3>



      <div

        style={{

          display:"grid",

          gridTemplateColumns:
          "repeat(auto-fit,minmax(140px,1fr))",

          gap:10,

          marginTop:15,

        }}

      >

        {button(
          onStart,
          "▶️ Start",
          "#16a34a"
        )}


        {button(
          onPause,
          "⏸ Pause",
          "#f59e0b"
        )}


        {button(
          onRefresh,
          "📍 Refresh",
          "#2563eb"
        )}


        {button(
          onStop,
          "⛔ Stop",
          "#dc2626"
        )}

      </div>



      <div

        style={{

          marginTop:20,

          padding:10,

          background:"#f8fafc",

          borderRadius:8,

        }}

      >

        <p>

          <b>Booking ID:</b>

          {" "}

          {booking?.id || "-"}

        </p>


        <p>

          <b>Status:</b>

          {" "}

          {booking?.booking_status ||
          booking?.status ||
          "Tracking"}

        </p>


      </div>


    </div>

  );

}
