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
}) {

return (

<div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 pb-10">


{/* TOP HEADER */}

<div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 text-white rounded-3xl p-6 shadow-xl">

<div className="flex justify-between items-center">

<div>

<h1 className="text-3xl font-extrabold">
🌱 KisanSetu
</h1>

<p className="mt-3 text-lg">
Namaste {user?.name || "Kisan"} 👋
</p>

<p className="text-sm opacity-90">
Farmer Account • Maharashtra
</p>

</div>


<div className="bg-white/20 rounded-full p-4 text-3xl">
👨‍🌾
</div>

</div>

</div>



{/* SUBSCRIPTION */}

<div className="mt-5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-3xl p-6 text-white shadow-xl">


<h2 className="text-2xl font-bold">
🌾 KisanSetu Premium
</h2>


<p className="mt-2">
₹550 / Acre / Year
</p>


<div className="mt-3 text-sm">

✓ Tractor Booking  
<br/>
✓ Priority Service  
<br/>
✓ Farm Support

</div>


<button

onClick={onSubscription}

className="mt-5 bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold shadow"

>

Activate Now

</button>


</div>





{/* SERVICES */}

<h2 className="text-2xl font-bold mt-7">
🚜 Farm Services
</h2>


<div className="grid grid-cols-2 gap-4 mt-4">


<button
onClick={onBook}
className="bg-white rounded-3xl p-5 shadow hover:scale-105 transition"
>

<div className="text-4xl">
🚜
</div>

<h3 className="font-bold mt-2 text-green-700">
Tractor
</h3>

<p className="text-sm">
Book Service
</p>

</button>



<button
onClick={onBook}
className="bg-white rounded-3xl p-5 shadow"
>

<div className="text-4xl">
🌱
</div>

<h3 className="font-bold mt-2 text-green-700">
Rotavator
</h3>

<p className="text-sm">
Farm Work
</p>

</button>



<button
onClick={onBook}
className="bg-white rounded-3xl p-5 shadow"
>

<div className="text-4xl">
🌾
</div>

<h3 className="font-bold mt-2 text-green-700">
Cultivator
</h3>

<p className="text-sm">
Soil Preparation
</p>

</button>



<button
onClick={onBook}
className="bg-white rounded-3xl p-5 shadow"
>

<div className="text-4xl">
📋
</div>

<h3 className="font-bold mt-2 text-blue-700">
Bookings
</h3>

<p className="text-sm">
History
</p>

</button>


</div>





{/* ADMIN */}

{
user?.role==="admin" &&

<div className="mt-6 bg-purple-100 rounded-3xl p-5">

<h2 className="font-bold text-purple-700">
👑 Admin Panel
</h2>

<button
onClick={onAdmin}
className="mt-3 w-full bg-purple-600 text-white p-3 rounded-xl"
>
Open Dashboard
</button>

</div>

}




{/* DRIVER */}

{
user?.role==="driver" &&

<div className="mt-6 bg-blue-100 rounded-3xl p-5">

<h2 className="font-bold text-blue-700">
🚜 Driver Panel
</h2>

<button
onClick={onDriver}
className="mt-3 w-full bg-blue-600 text-white p-3 rounded-xl"
>
Open Driver
</button>

</div>

}





{/* MENU */}

<div className="mt-7 space-y-3">


<button
onClick={onProfile}
className="w-full bg-white p-4 rounded-2xl shadow font-bold text-left"
>
👤 Profile
</button>



<button
onClick={onNotifications}
className="w-full bg-white p-4 rounded-2xl shadow font-bold text-left"
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
