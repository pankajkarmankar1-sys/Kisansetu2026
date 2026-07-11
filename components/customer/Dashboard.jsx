import React from "react";

export default function Dashboard({
  user,
  onBook,
  onBookings,
  onProfile,
  onNotifications,
  onSubscription,
  onAddFarm,
  onLogout,
}) {


  const documentsApproved =
    user?.document_status === "approved";


  const subscriptionActive =
    user?.subscription_status === "active";



  return (

    <div
      style={{
        padding:20,
        minHeight:"100vh",
        background:"#f5f7fb",
      }}
    >

      <h1>
        🚜 KisanSetu Dashboard
      </h1>


      <h2>
        Welcome {user?.name || "User"}
      </h2>




      <div
        style={{
          background:"#fff",
          padding:15,
          borderRadius:12,
          marginTop:15
        }}
      >

        <h3>
          👑 Subscription Status
        </h3>


        {
          subscriptionActive

          ?

          <>
            <p>
              ✅ Active
            </p>

            <p>
              📅 Valid Till:
              {" "}
              {user?.subscription_end || "-"}
            </p>
          </>

          :

          <p>
            ❌ No Active Subscription
          </p>

        }


      </div>






      {
        !documentsApproved && (

          <div
            style={{
              background:"#fef3c7",
              padding:15,
              borderRadius:10,
              marginTop:15
            }}
          >

            ⚠️ Documents verification pending.
            <br/>
            Aadhaar approve hone ke baad booking open hogi.

          </div>

        )
      }





      <div
        style={{
          display:"grid",
          gap:12,
          marginTop:25,
        }}
      >



        <button
          onClick={onAddFarm}
          style={{
            padding:15,
            background:"#16a34a",
            color:"#fff",
            border:"none",
            borderRadius:10,
          }}
        >
          🌾 Add New Farm
        </button>





        <button
          onClick={documentsApproved ? onBook : undefined}
          disabled={!documentsApproved}
          style={{
            padding:15,
            opacity: documentsApproved ? 1 : 0.5
          }}
        >
          📅 Book Service
        </button>





        <button
          onClick={onSubscription}
          style={{
            padding:15,
            background:"#f59e0b",
            color:"#fff",
            border:"none",
            borderRadius:10,
          }}
        >
          👑 Buy Subscription
        </button>





        <button
          onClick={onBookings}
          style={{
            padding:15
          }}
        >
          📋 My Bookings
        </button>





        <button
          onClick={onProfile}
          style={{
            padding:15
          }}
        >
          👤 Profile
        </button>





        <button
          onClick={onNotifications}
          style={{
            padding:15
          }}
        >
          🔔 Notifications
        </button>





        <button
          onClick={onLogout}
          style={{
            padding:15,
            background:"#dc2626",
            color:"#fff",
            border:"none",
          }}
        >
          Logout
        </button>



      </div>


    </div>

  );

}
