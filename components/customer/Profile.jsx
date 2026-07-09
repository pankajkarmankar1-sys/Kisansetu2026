import React from "react";
import SubscriptionStatus from "./SubscriptionStatus";


export default function Profile({
  user,
  back,
}) {


  return (

    <div

      style={{

        padding:20,

        background:"#f5f7fb",

        minHeight:"100vh",

      }}

    >



      <button

        onClick={back}

        style={{

          padding:10,

          marginBottom:20,

        }}

      >

        ← Back

      </button>






      <h1>
        👤 Farmer Profile
      </h1>






      <div

        style={{

          background:"#fff",

          padding:20,

          borderRadius:12,

          marginTop:20,

        }}

      >



        <p>

          👨‍🌾 Name:

          {" "}

          {user?.name || "-"}

        </p>




        <p>

          📱 Mobile:

          {" "}

          {user?.phone || "-"}

        </p>




        <p>

          🏠 State:

          {" "}

          {user?.state || "-"}

        </p>




        <p>

          📍 District:

          {" "}

          {user?.district || "-"}

        </p>




        <p>

          📍 Taluka:

          {" "}

          {user?.taluka || "-"}

        </p>




        <p>

          🌱 Village:

          {" "}

          {user?.village || "-"}

        </p>




        <p>

          🌾 Farm Address:

          {" "}

          {user?.farm_address || "-"}

        </p>




        <p>

          📐 Acres:

          {" "}

          {user?.acres || 0}

        </p>




        <p>

          📄 Documents:

          {" "}

          {

          user?.document_status === "approved"

          ?

          "✅ Approved"

          :

          "⏳ Pending"

          }

        </p>




      </div>






      <SubscriptionStatus

        user={user}

      />




    </div>

  );

}
