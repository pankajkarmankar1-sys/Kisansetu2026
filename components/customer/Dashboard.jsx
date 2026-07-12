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
    (sum,farm)=> sum + Number(farm.acres || 0),
    0
  );



  const villageStats = {};

  farms.forEach((farm)=>{

    const village =
    farm.village || "Unknown";


    if(!villageStats[village]){

      villageStats[village] = {
        farms:0,
        acres:0
      };

    }


    villageStats[village].farms += 1;

    villageStats[village].acres +=
    Number(farm.acres || 0);


  });



  return (

    <div className="min-h-screen bg-green-50 p-4">


      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-6 shadow">

        <h1 className="text-3xl font-bold">
          🚜 KisanSetu
        </h1>

        <p className="mt-2">
          Namaste {user?.name || "Kisan"} 🌾
        </p>

      </div>




      <div className="grid grid-cols-3 gap-3 mt-5">


        <div className="bg-white rounded-2xl p-4 shadow">

          <p>
            🌱 Farms
          </p>

          <h2 className="text-2xl font-bold text-green-700">
            {farms.length}
          </h2>

        </div>



        <div className="bg-white rounded-2xl p-4 shadow">

          <p>
            📏 Acres
          </p>

          <h2 className="text-2xl font-bold text-green-700">
            {totalAcres}
          </h2>

        </div>



        <div className="bg-white rounded-2xl p-4 shadow">

          <p>
            📄 7/12
          </p>

          <h2 className="text-2xl font-bold text-green-700">
            {farms.length}
          </h2>

        </div>


      </div>





      <div className="bg-white rounded-2xl p-5 mt-5 shadow">


        <h3 className="text-xl font-bold">
          👑 Subscription
        </h3>



        {
          subscriptionActive

          ?

          <div className="mt-3">

            <p className="text-green-600 font-bold">
              ✅ Active
            </p>

            <p>
              🔥 50% OFF Applied
            </p>

            <p>
              Valid Till:
              {" "}
              {user?.subscription_end || "-"}
            </p>

          </div>


          :


          <div className="mt-3">

            <p className="text-red-500">
              ❌ No Subscription
            </p>


            <button
              onClick={onSubscription}
              className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-xl"
            >

              Buy Subscription

            </button>


          </div>

        }


      </div>





      <div className="bg-white rounded-2xl p-5 mt-5 shadow">


        <h3 className="font-bold text-xl mb-3">
          📍 Village Wise Stats
        </h3>



        {
          Object.keys(villageStats).map((village)=>(

            <div
              key={village}
              className="border-b py-3 flex justify-between"
            >

              <span>
                🌾 {village}
              </span>


              <span>
                {villageStats[village].farms} Farm /
                {" "}
                {villageStats[village].acres} Acre
              </span>


            </div>

          ))
        }


      </div>





      {
        !documentsApproved && (

          <div className="bg-yellow-100 rounded-xl p-4 mt-5">

            ⚠️ Documents approval pending.
            <br/>
            Approval ke baad booking open hogi.

          </div>

        )
      }






      <div className="space-y-3 mt-5">


        <button
          onClick={onAddFarm}
          className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold"
        >
          ➕ Add Another 7/12
        </button>



        <button
          onClick={documentsApproved ? onBook : undefined}
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold"
        >
          🚜 Book Service
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
