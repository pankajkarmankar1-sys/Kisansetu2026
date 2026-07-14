import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function DriverBookings({ driver }) {


const [bookings,setBookings] = useState([]);

const [loading,setLoading] = useState(true);

const [otp,setOtp] = useState("");





useEffect(()=>{

if(driver?.id){

loadBookings();

}

},[driver]);






async function loadBookings(){


try{


setLoading(true);



const {

data,

error

}=await supabase

.from("bookings")

.select("*")

.or(
`driver_id.eq.${driver.id},driver_id.is.null`
)

.order(
"created_at",
{
ascending:false
}
);





if(error)
throw error;



setBookings(data || []);




}
catch(err){

console.log(
"Booking Error:",
err.message
);

}

finally{

setLoading(false);

}


}








async function acceptBooking(id){


try{


const {

error

}=await supabase

.from("bookings")

.update({

driver_id:driver.id,

status:"Accepted",

work_status:"Assigned"

})

.eq(
"id",
id
)

.is(
"driver_id",
null
);





if(error)
throw error;




alert(
"✅ Booking Accepted"
);



loadBookings();



}
catch(err){

alert(err.message);

}


}








async function completeWork(booking){


if(otp !== "1234"){


alert(
"Wrong OTP"
);


return;


}



try{


const {

error

}=await supabase

.from("bookings")

.update({

status:"Completed",

work_status:"Completed",

otp_verified:true

})

.eq(
"id",
booking.id
);





if(error)
throw error;




alert(
"🎉 Work Completed"
);



setOtp("");

loadBookings();



}
catch(err){

alert(err.message);

}


}
  if(loading){

return(

<div className="p-5 text-xl font-bold text-green-700">

🚜 Loading Bookings...

</div>

);

}






return(

<div className="min-h-screen bg-green-50 p-5">



<h2 className="text-2xl font-bold text-green-700 mb-5">

🚜 Customer Bookings

</h2>






{
bookings.length===0 &&

<div className="bg-white rounded-3xl p-6 shadow">

No Booking Available

</div>

}








{
bookings.map((booking)=>(


<div

key={booking.id}

className="bg-white rounded-3xl shadow-xl p-6 mb-5"

>



<h3 className="text-xl font-bold text-green-700">

🚜 {booking.service_name}

</h3>






<p className="mt-3">

👨‍🌾 Customer:

<b>

{" "}

{booking.customer_name || "-"}

</b>

</p>





<p className="mt-2">

📞 Mobile:

<b>

{" "}

{booking.customer_phone || "-"}

</b>

</p>






<p className="mt-2">

📍 Village:

<b>

{" "}

{booking.village || "-"}

</b>

</p>






<p className="mt-2">

🌾 Acre:

<b>

{" "}

{booking.acres}

</b>

</p>







<p className="mt-2">

📅 Date:

<b>

{" "}

{booking.booking_date}

</b>

</p>







<p className="mt-2">

💰 Amount:

<b>

{" "}

₹{booking.amount}

</b>

</p>







<p className="mt-2">

Status:

<b>

{" "}

{booking.status}

</b>

</p>







{
booking.status==="Pending"
&&


<button

onClick={()=>acceptBooking(booking.id)}

className="w-full bg-green-600 text-white p-4 rounded-2xl mt-5 font-bold"

>

✅ Accept Booking

</button>

}








{
booking.status==="Accepted"
&&


<div className="mt-5 bg-blue-50 rounded-2xl p-4">


<h3 className="font-bold">

🔐 Work Completion OTP

</h3>




<p className="text-gray-600 mt-2">

Customer se OTP lekar enter kare

</p>




<input

type="number"

value={otp}

onChange={(e)=>
setOtp(e.target.value)
}

placeholder="Enter OTP"

className="w-full p-3 rounded-xl border mt-3"

/>







<button

onClick={()=>completeWork(booking)}

className="w-full bg-blue-600 text-white p-4 rounded-2xl mt-4 font-bold"

>

🚜 Complete Work

</button>




</div>


}








{
booking.status==="Completed"

&&

<div className="mt-5 bg-green-100 p-4 rounded-2xl font-bold text-green-700">

✅ Work Completed Successfully

</div>

}





</div>



))

}





</div>


);


}
