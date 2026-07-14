import React from "react";

export default function Dashboard({
  user,
  farms = [],
  onBook,
  onBookings,
  onProfile,
  onNotifications,
  onSubscription,
  onLogout,
  onAddFarm,
}) {

return (

<div className="min-h-screen bg-green-50 p-4 pb-24">


{/* ================= HEADER ================= */}

<div
className="rounded-3xl p-6 shadow-2xl text-white"
style={{
background:
"linear-gradient(135deg,#1B5E20,#2E7D32,#43A047)"
}}
>

<p className="text-green-100">
Welcome Back
</p>

<h1 className="text-3xl font-extrabold mt-2">
🌾 KisanSetu
</h1>


<h2 className="text-xl font-bold mt-5">
Namaste {user?.name || "Kisan"} 👋
</h2>


<p>
Farmer Account
</p>


</div>



{/* ================= MY FARM ================= */}


<div className="bg-white rounded-3xl shadow-xl p-6 mt-6">


<div className="flex justify-between items-center">


<div>

<h2 className="text-2xl font-bold text-green-700">
🌾 Mera Khet
</h2>


<p className="text-gray-500">
Registered Farms
</p>


<h1 className="text-5xl font-bold text-green-700">
{farms.length}
</h1>


</div>



<button
onClick={onAddFarm}
className="bg-green-600 text-white px-5 py-3 rounded-2xl font-bold"
>
➕ Add Farm
</button>


</div>


</div>





{/* ================= PREMIUM ================= */}


<div
className="rounded-3xl p-6 mt-6 shadow-xl"
style={{
background:
"linear-gradient(135deg,#F9A825,#FFD54F)"
}}
>


<h2 className="text-3xl font-bold text-white">
💎 KisanSetu Premium
</h2>


<p className="text-white text-xl mt-3">
₹550 / Acre / Year
</p>


<div className="text-white mt-4">

✅ Priority Booking

<br/>

✅ Tractor Services

<br/>

✅ Crop Guidance

<br/>

✅ Farmer Support

</div>



<button
onClick={onSubscription}
className="bg-white text-green-700 px-6 py-3 rounded-2xl mt-5 font-bold"
>

Activate Premium

</button>


</div>





{/* ================= SERVICES ================= */}


<h2 className="text-2xl font-bold text-green-700 mt-8">
🚜 Farm Services
</h2>


<div className="grid grid-cols-2 gap-4 mt-4">


<Card
icon="🚜"
title="Tractor"
text="Tractor Booking"
click={onBook}
/>


<Card
icon="🌱"
title="Rotavator"
text="Land Preparation"
click={onBook}
/>


<Card
icon="🌾"
title="Cultivator"
text="Soil Work"
click={onBook}
/>


<Card
icon="💧"
title="Spraying"
text="Crop Spraying"
click={onBook}
/>


<Card
icon="🌿"
title="Seeder"
text="Seed Sowing"
click={onBook}
/>


<Card
icon="🚛"
title="Transport"
text="Farm Transport"
click={onBook}
/>


<Card
icon="🌽"
title="Harvester"
text="Harvesting"
click={onBook}
/>


<Card
icon="📋"
title="Bookings"
text="My Bookings"
click={onBookings}
/>


</div>
  {/* ================= SUBSCRIPTION STATUS ================= */}

<div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

<h2 className="text-xl font-bold text-green-700">
🌱 Subscription Status
</h2>


<p className="mt-3 font-bold">

{
user?.subscription_status === "active"
?
"✅ Active"
:
"❌ Not Active"
}

</p>



<button
onClick={onSubscription}
className="bg-green-600 text-white px-5 py-3 rounded-2xl mt-4 font-bold"
>

View Subscription

</button>


</div>





{/* ================= UPCOMING BOOKING ================= */}


<div className="bg-white rounded-3xl shadow-xl p-6 mt-6">


<h2 className="text-xl font-bold text-green-700">
📅 Upcoming Booking
</h2>


<p className="text-gray-500 mt-3">
No upcoming booking available.
</p>


</div>






{/* ================= SUPPORT ================= */}


<div className="bg-white rounded-3xl shadow-xl p-6 mt-6">


<h2 className="text-xl font-bold text-green-700">
☎ Help & Support
</h2>


<p className="mt-3 text-gray-600">
Need help? Contact KisanSetu Support.
</p>


</div>







{/* ================= PROFILE ================= */}


<div className="grid grid-cols-2 gap-4 mt-8">



<button
onClick={onProfile}
className="bg-white rounded-3xl p-5 shadow-xl"
>

<div className="text-4xl">
👤
</div>


<h3 className="font-bold mt-3">
Profile
</h3>


<p className="text-sm text-gray-500">
My Account
</p>


</button>





<button
onClick={onNotifications}
className="bg-white rounded-3xl p-5 shadow-xl"
>


<div className="text-4xl">
🔔
</div>


<h3 className="font-bold mt-3">
Notifications
</h3>


<p className="text-sm text-gray-500">
Alerts
</p>


</button>


</div>







{/* ================= LOGOUT ================= */}


<button

onClick={onLogout}

className="w-full bg-red-600 text-white rounded-3xl p-5 mt-6 font-bold shadow-xl"

>

🚪 Logout

</button>








{/* ================= BOTTOM NAV ================= */}


<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl">


<div className="grid grid-cols-5 text-center py-3">



<button>

<div className="text-2xl">
🏠
</div>

<div className="text-xs">
Home
</div>

</button>




<button
onClick={onAddFarm}
>

<div className="text-2xl">
🌾
</div>

<div className="text-xs">
Farms
</div>

</button>





<button
onClick={onBook}
>

<div className="text-2xl">
🚜
</div>

<div className="text-xs">
Book
</div>

</button>





<button
onClick={onBookings}
>

<div className="text-2xl">
📋
</div>

<div className="text-xs">
Bookings
</div>

</button>





<button
onClick={onProfile}
>

<div className="text-2xl">
👤
</div>

<div className="text-xs">
Profile
</div>

</button>



</div>


</div>



</div>

);

}






function Card({
icon,
title,
text,
click
}){


return(

<button

onClick={click}

className="bg-white rounded-3xl p-5 shadow-xl text-left hover:scale-105 transition"

>


<div className="text-5xl">
{icon}
</div>


<h3 className="font-bold text-green-700 mt-3">
{title}
</h3>


<p className="text-gray-500 mt-2">
{text}
</p>


</button>


);


}
