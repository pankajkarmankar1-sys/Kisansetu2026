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

<div className="min-h-screen bg-gray-50 pb-20">


{/* Header */}

<div className="bg-gradient-to-br from-green-700 to-emerald-500 text-white p-5 rounded-b-3xl shadow-lg">


<div className="flex justify-between items-center">

<div>

<p className="text-sm opacity-80">
Welcome Back 👋
</p>

<h1 className="text-2xl font-bold">
{user?.name || "Kisan"}
</h1>


<p className="text-sm mt-1">
👨‍🌾 Farmer Account
</p>

</div>


<div className="bg-white/20 p-3 rounded-full text-3xl">
🌱
</div>


</div>


</div>





{/* Quick Stats */}

<div className="grid grid-cols-2 gap-3 px-4 mt-4">


<div className="bg-white rounded-2xl p-4 shadow">

<p className="text-gray-500 text-sm">
My Farm
</p>

<h2 className="font-bold text-green-700 text-xl">
🌾 Active
</h2>

</div>



<div className="bg-white rounded-2xl p-4 shadow">

<p className="text-gray-500 text-sm">
Bookings
</p>

<h2 className="font-bold text-blue-700 text-xl">
🚜 Check
</h2>

</div>


</div>





{/* Subscription */}

<div className="mx-4 mt-4 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-2xl p-5 text-white">


<div className="flex justify-between">

<div>

<h2 className="font-bold text-lg">
🌾 KisanSetu Premium
</h2>

<p className="text-sm">
₹550 / Acre / Year
</p>

</div>


<span className="text-3xl">
⭐
</span>


</div>


<button

onClick={onSubscription}

className="mt-4 bg-white text-orange-600 px-5 py-2 rounded-xl font-bold"

>

Activate Now

</button>


</div>







{/* Services */}

<div className="px-4 mt-6">


<h2 className="font-bold text-xl">
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
name="Sprayer"
click={onBook}
/>


<Service
icon="📋"
name="Bookings"
click={onBookings}
/>


<Service
icon="👤"
name="Profile"
click={onProfile}
/>


</div>


</div>






{/* Admin */}

{
user?.role==="admin" &&

<div className="mx-4 mt-5 bg-purple-100 p-4 rounded-2xl">

<button
onClick={onAdmin}
className="w-full bg-purple-600 text-white p-3 rounded-xl font-bold"
>

👑 Admin Dashboard

</button>

</div>

}





{/* Driver */}

{
user?.role==="driver" &&

<div className="mx-4 mt-5 bg-blue-100 p-4 rounded-2xl">

<button
onClick={onDriver}
className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold"
>

🚜 Driver Panel

</button>

</div>

}





{/* Bottom Menu */}

<div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3">


<button onClick={()=>{}}>
🏠
<br/>
Home
</button>


<button onClick={onBook}>
🚜
<br/>
Book
</button>


<button onClick={onNotifications}>
🔔
<br/>
Alerts
</button>


<button onClick={onProfile}>
👤
<br/>
Profile
</button>


</div>





</div>

);

}





function Service({icon,name,click}){

return (

<button

onClick={click}

className="bg-white rounded-2xl p-3 shadow text-center"

>

<div className="text-3xl">
{icon}
</div>

<p className="text-sm font-bold mt-2">
{name}
</p>


</button>

)

}
