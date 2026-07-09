import React, { useState } from "react";
import SubscriptionStatus from "./SubscriptionStatus";
import EditProfile from "./EditProfile";


export default function Profile({
  user,
  back,
}) {


  const [edit,setEdit] = useState(false);



  if(edit){

    return (

      <EditProfile

        user={user}

        onDone={()=>setEdit(false)}

        back={()=>setEdit(false)}

      />

    );

  }





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





      <button

        onClick={()=>setEdit(true)}

        style={{

          width:"100%",

          padding:14,

          marginTop:15,

          background:"#2563eb",

          color:"#fff",

          border:"none",

          borderRadius:10,

        }}

      >

        ✏️ Edit Profile

      </button>







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
          📱 Phone:
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
          🚜 Farm Address:
          {" "}
          {user?.farm_address || "-"}
        </p>




        <p>
          🌾 Acres:
          {" "}
          {user?.acres || 0}
        </p>




        <p>
          📄 Document Status:
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
