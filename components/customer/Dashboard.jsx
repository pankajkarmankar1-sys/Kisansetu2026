import React from "react";

export default function Dashboard({
  user,
  farms = [],
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


  const totalAcres = farms.reduce(
    (sum, farm) =>
      sum + Number(farm.acres || 0),
    0
  );



  return (

    <div className="min-h-screen bg-green-50 p-4">


      {/* Header */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-6 shadow-xl">

        <h1 className="text-3xl font-bold">
          🚜 KisanSetu
        </h1>

        <p className="mt-2 text-lg">
          Namaste {user?.name || "Kisan"} 🌾
        </p>

      </div>





      {/* Farm Summary */}

      <div className="grid grid-cols-2 gap-4 mt-5">


        <div className="bg-white rounded-2xl p-5 shadow">

          <p>
            🌱 My Farms
          </p>

          <h2 className="text-3xl font-bold text-green-700">
            {farms.length}
          </h2>

        </div>




        <div className="bg-white rounded-2xl p-5 shadow">

          <p>
            📏 Total Acre
          </p>

          <h2 className="text-3xl font-bold text-green-700">
            {totalAcres}
          </h2>

        </div>


      </div>






      {/* Subscription */}

      <div className="bg-white rounded-3xl p-5 mt-5 shadow-xl border">


        <h2 className="text-2xl font-bold text-green-700">
          👑 KisanSetu Subscription
        </h2>



        {
          subscriptionActive

          ?

          <div className="mt-4 bg-green-50 rounded-2xl p-4">

            <h3 className="text-green-700 font-bold text-xl">
              ✅ Active Subscription
            </h3>

            <p className="mt-2">
              🎉 50% OFF Applied
            </p>

            <p>
              Valid Till: {user?.subscription_end || "-"}
            </p>

          </div>


          :


          <div className="mt-4 bg-orange-50 rounded-2xl p-4">

            <p className="text-xl font-bold">
              🔥 50% OFF Offer
            </p>


            <p className="text-2xl font-bold text-green-700 mt-2">
              ₹550 / Acre / Year
            </p>


            <p className="text-gray-600 mt-2">
              Subscription lene ke baad har service par special rate milega.
            </p>



            <button

              onClick={onSubscription}

              className="w-full mt-4 bg-orange-500 text-white p-4 rounded-2xl font-bold"

            >

              Buy Subscription

            </button>


          </div>

        }


      </div>








      {/* Services */}

      <div className="bg-white rounded-3xl p-5 mt-5 shadow-xl">


        <h2 className="text-2xl font-bold text-green-700 mb-4">
          🚜 Our Services
        </h2>



        <div className="grid grid-cols-2 gap-4">


          <button
            onClick={documentsApproved ? onBook : undefined}
            className="bg-green-100 p-5 rounded-2xl font-bold"
          >
            🚜 Tractor
          </button>



          <button
            onClick={documentsApproved ? onBook : undefined}
            className="bg-blue-100 p-5 rounded-2xl font-bold"
          >
            🌱 Cultivator
          </button>



          <button
            onClick={documentsApproved ? onBook : undefined}
            className="bg-yellow-100 p-5 rounded-2xl font-bold"
          >
            ⚙️ Rotavator
          </button>



          <button
            onClick={documentsApproved ? onBook : undefined}
            className="bg-purple-100 p-5 rounded-2xl font-bold"
          >
            🌾 Harvester
          </button>


        </div>


      </div>






      {
        !documentsApproved && (

          <div className="bg-yellow-100 rounded-2xl p-4 mt-5">

            ⚠️ Documents approval pending.
            <br/>
            Approval ke baad booking open hogi.

          </div>

        )
      }







      {/* Buttons */}

      <div className="space-y-3 mt-5">


        <button
          onClick={onAddFarm}
          className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold"
        >
          ➕ Add Farm / 7-12
        </button>



        <button
          onClick={onBookings}
          className="w-full bg-white p-4 rounded-2xl shadow font-bold"
        >
          📋 My Bookings
        </button>



        <button
          onClick={onProfile}
          className="w-full bg-white p-4 rounded-2xl shadow font-bold"
        >
          👤 Profile
        </button>



        <button
          onClick={onNotifications}
          className="w-full bg-white p-4 rounded-2xl shadow font-bold"
        >
          🔔 Notifications
        </button>



        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white p-4 rounded-2xl font-bold"
        >
          Logout
        </button>


      </div>


    </div>

  );

}
