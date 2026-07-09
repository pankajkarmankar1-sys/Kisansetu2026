import React from "react";

export default function Dashboard({
  user,
  onBook,
  onBookings,
  onProfile,
  onNotifications,
  onLogout,
}) {

  const documentsApproved =
    user?.document_status === "approved";


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
            Aadhaar & 7/12 approve hone ke baad booking open hogi.

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
