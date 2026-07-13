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

<div className="min-h-screen bg-gray-50 pb-20">


{/* HEADER */}

<div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white px-5 py-4 rounded-b-3xl">

<div className="flex justify-between items-center">

<div>

<h1 className="text-xl font-bold">
🌱 KisanSetu
</h1>

<p className="mt-1 text-sm">
Namaste {user?.name || "Kisan"} 👋
</p>

<p className="text-xs opacity-80">
👨‍🌾 Farmer Account
</p>

</div>


<div className="text-3xl">
🌾
</div>

</div>

</div>





{/* FARM CARD */}

<div className="px-4 mt-4">


<div className="bg-white rounded-2xl p-4 shadow-sm border">


<div className="flex justify-between">


<div>

<p className="text-gray-500 text-sm">
My Farm
</p>


<h2 className="font-bold text-green-700 text-lg">
{farms.length} Farm Added
</h2>


</div>


<button

onClick={onAddFarm}

className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"

>

+ Add

</button>


</div>


</div>

</div>







{/* SUBSCRIPTION */}

<div className="px-4 mt-4">


<div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-2xl p-4 text-white">


<div className="flex justify-between">


<div>

<h2 className="font-bold">
🌾 KisanSetu Premium
</h2>

<p className="text-sm">
₹550 / Acre / Year
</p>


</div>


<span>
⭐
</span>


</div>


<button

onClick={onSubscription}

className="mt-3 bg-white text-orange-600 px-5 py-2 rounded-xl text-sm font-bold"

>

Activate

</button>


</div>


</div>






{/* SERVICES */}


<div className="px-4 mt-5">


<h2 className="font-bold text-lg">
🚜 Services
</h2>


<div className="grid grid-cols-3 gap-3 mt-3">


<Service
icon="🚜"
name="Tractor"
click={onBook}
/>


<Service
icon="🌱"
name="Rotavator"
click={onBook}
/>


<Service
icon="🌾"
name="Cultivator"
click={onBook}
/>


<Service
icon="💧"
name="Spray"
click={onBook}
/>


<Service
icon="📋"
name="Booking"
click={onBookings}
/>


<Service
icon="🔔"
name="Alert"
click={onNotifications}
/>


</div>

</div>






{/* ADMIN */}

{
user?.role==="admin" &&

<div className="px-4 mt-4">

<button

onClick={onAdmin}

className="w-full bg-purple-600 text-white p-3 rounded-xl"

>

👑 Admin Dashboard

</button>

</div>

}





{/* DRIVER */}

{
user?.role==="driver" &&

<div className="px-4 mt-4">

<button

onClick={onDriver}

className="w-full bg-blue-600 text-white p-3 rounded-xl"

>

🚜 Driver Panel

</button>

</div>

}





{/* BOTTOM MENU */}

<div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">


<button onClick={()=>{}}>
🏠
<span className="block text-xs">
Home
</span>
</button>


<button onClick={onBook}>
🚜
<span className="block text-xs">
Book
</span>
</button>


<button onClick={onProfile}>
👤
<span className="block text-xs">
Profile
</span>
</button>


<button onClick={onLogout}>
🚪
<span className="block text-xs">
Exit
</span>
</button>


</div>


</div>

);

}



function Service({icon,name,click}){

return (

<button

onClick={click}

className="bg-white rounded-xl p-3 shadow-sm border text-center"

>


<div className="text-2xl">
{icon}
</div>


<p className="text-xs font-semibold mt-1">
{name}
</p>


</button>

)

}
