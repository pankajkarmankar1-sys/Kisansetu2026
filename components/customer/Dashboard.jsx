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
  onAdmin,
  onDriver,
}) {

return (

<div className="min-h-screen bg-green-50 p-4">


{/* HEADER CARD */}

<div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white rounded-3xl p-6 shadow-xl">

<div className="flex justify-between items-center">

<div>

<h1 className="text-3xl font-extrabold">
🌱 KisanSetu
</h1>

<p className="mt-3 text-xl font-bold">
Namaste {user?.name || "Kisan"} 👋
</p>

<p className="mt-1">
👨‍🌾 Farmer Account
</p>

</div>


<div className="text-5xl">
🌾
</div>


</div>

</div>





{/* FARM CARD */}

<div className="mt-5 bg-white rounded-3xl p-6 shadow-lg">


<div className="flex justify-between">


<div>

<h2 className="text-xl font-bold text-green-700">
🏡 My Farm
</h2>

<p className="mt-2 text-gray-600">
{farms.length} Farm Added
</p>

</div>


<button

onClick={onAddFarm}

className="bg-green-600 text-white px-5 py-3 rounded-2xl font-bold"

>

+ Add Farm

</button>


</div>


</div>






{/* PREMIUM CARD */}

<div className="mt-5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-3xl p-6 text-white shadow-xl">


<h2 className="text-2xl font-bold">
🌾 KisanSetu Premium
</h2>


<p className="text-lg mt-2">
₹550 / Acre / Year
</p>


<div className="mt-3">

✓ Tractor Booking
<br/>
✓ Priority Service
<br/>
✓ Farm Support

</div>



<button

onClick={onSubscription}

className="mt-5 bg-white text-orange-600 px-7 py-3 rounded-2xl font-bold"

>

Activate Now

</button>


</div>







{/* SERVICES */}

<h2 className="text-2xl font-bold mt-7">
🚜 Farm Services
</h2>


<div className="grid grid-cols-2 gap-4 mt-4">



<Card
icon="🚜"
title="Tractor Service"
text="Book tractor work"
click={onBook}
/>


<Card
icon="🌱"
title="Rotavator"
text="Farm preparation"
click={onBook}
/>


<Card
icon="🌾"
title="Cultivator"
text="Soil work"
click={onBook}
/>


<Card
icon="📋"
title="My Bookings"
text="History"
click={onBookings}
/>



</div>







{/* ADMIN */}

{
user?.role==="admin" &&

<div className="mt-6 bg-purple-100 rounded-3xl p-5">


<button

onClick={onAdmin}

className="w-full bg-purple-600 text-white p-4 rounded-2xl font-bold"

>

👑 Admin Dashboard

</button>


</div>

}





{/* DRIVER */}

{
user?.role==="driver" &&

<div className="mt-6 bg-blue-100 rounded-3xl p-5">


<button

onClick={onDriver}

className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold"

>

🚜 Driver Panel

</button>


</div>

}





{/* PROFILE MENU */}


<div className="mt-6 space-y-4">


<button

onClick={onProfile}

className="w-full bg-white rounded-3xl p-5 shadow-lg text-left font-bold text-lg"

>

👤 Profile

</button>



<button

onClick={onNotifications}

className="w-full bg-white rounded-3xl p-5 shadow-lg text-left font-bold text-lg"

>

🔔 Notifications

</button>




<button

onClick={onLogout}

className="w-full bg-red-600 text-white rounded-3xl p-5 shadow-lg font-bold text-lg"

>

Logout

</button>


</div>



</div>

);

}





function Card({icon,title,text,click}){


return (

<button

onClick={click}

className="bg-white rounded-3xl p-6 shadow-xl text-left"

>


<div className="text-5xl">
{icon}
</div>


<h3 className="text-lg font-bold mt-3 text-green-700">
{title}
</h3>


<p className="text-gray-500 mt-1">
{text}
</p>


</button>

)


}
