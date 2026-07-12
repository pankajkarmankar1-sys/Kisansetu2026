import React from "react";


export default function Dashboard({

  user,

  onBook,
  onBookings,
  onProfile,
  onNotifications,
  onSubscription,
  onLogout,

  onAdmin,
  onDriver,

  <p>
ROLE TEST: {user?.role}
</p>
}) {


return (

<div className="min-h-screen bg-green-50 p-4">


{/* Header */}

<div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-6 shadow">

<h1 className="text-3xl font-bold">
🚜 KisanSetu
</h1>

<p className="mt-2 text-lg">
Namaste {user?.name || "Kisan"} 🌾
</p>

<p className="mt-1">
Role: {user?.role || "farmer"}
</p>

</div>





{/* Subscription Banner */}

<div className="mt-5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-3xl p-6 text-white shadow">


<h2 className="text-2xl font-bold">
🔥 50% OFF Subscription
</h2>


<p className="mt-2 text-lg">
₹550 / Acre / Yearly Plan
</p>


<button

onClick={onSubscription}

className="mt-4 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold"

>

Buy Subscription

</button>


</div>






<h2 className="text-2xl font-bold mt-6">
🚜 Services
</h2>



<div className="grid gap-4 mt-4">


<button

onClick={onBook}

className="bg-white rounded-3xl p-6 shadow text-left"

>

<h3 className="text-xl font-bold text-green-700">
🌱 Tractor Service
</h3>

<p>
Book tractor, rotavator, cultivator services
</p>

</button>



<button

onClick={onBookings}

className="bg-white rounded-3xl p-6 shadow text-left"

>

<h3 className="text-xl font-bold text-blue-700">
📋 My Bookings
</h3>

<p>
Check your service history
</p>

</button>


</div>






{/* ADMIN */}

{
user?.role === "admin" && (

<div className="mt-6 bg-purple-100 rounded-3xl p-5 shadow">

<h2 className="text-xl font-bold text-purple-700">
👑 Admin Control
</h2>

<button

onClick={onAdmin}

className="mt-3 w-full bg-purple-600 text-white p-4 rounded-xl font-bold"

>

Open Admin Dashboard

</button>

</div>

)

}







{/* DRIVER */}

{
user?.role === "driver" && (

<div className="mt-6 bg-blue-100 rounded-3xl p-5 shadow">

<h2 className="text-xl font-bold text-blue-700">
🚜 Driver Panel
</h2>

<button

onClick={onDriver}

className="mt-3 w-full bg-blue-600 text-white p-4 rounded-xl font-bold"

>

Open Driver Dashboard

</button>

</div>

)

}







<div className="space-y-3 mt-6">



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
