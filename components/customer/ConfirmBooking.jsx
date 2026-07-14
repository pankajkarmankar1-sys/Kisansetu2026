import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function ConfirmBooking({
  bookingData,
  onConfirm,
  back,
}) {


const [loading,setLoading] = useState(false);

const [amount,setAmount] = useState(0);

const [rate,setRate] = useState(0);





useEffect(()=>{

calculateAmount();

},[bookingData]);






function calculateAmount(){


const service =
bookingData?.selectedService;



const acres =
Number(
bookingData?.acres || 0
);




const price =
Number(
service?.normal || 0
);



const total =
price * acres;



setRate(price);

setAmount(total);



return total;


}









async function handleConfirm(){


try{


setLoading(true);



const {
data:{
user
}
}=await supabase.auth.getUser();




if(!user){

alert("Login required");

return;

}






const finalAmount =
calculateAmount();






const farm =
bookingData?.selKhet;





const booking={



customer_id:user.id,


customer_name:
user.user_metadata?.name ||
"Kisan",



customer_phone:
user.phone || "",





farm_id:
farm?.id || null,


farm_name:
farm?.name || "",



village:
farm?.village || "",



service_name:
bookingData?.selectedService?.name || "",



acres:
Number(
bookingData?.acres || 0
),



amount:
finalAmount,


total_amount:
finalAmount,



payment_status:
bookingData?.payment_status || "Paid",



status:
"Pending",



booking_status:
"Pending",



work_status:
"Pending",



booking_date:
bookingData?.date || null,



note:
bookingData?.note || "",



otp_verified:false


};






const {
data,
error
}=await supabase

.from("bookings")

.insert(booking)

.select()

.single();





if(error)
throw error;




alert(
"✅ Booking Confirmed"
);



if(onConfirm){

onConfirm(data);

}





}

catch(err){

console.log(err);

alert(err.message);

}


finally{

setLoading(false);

}



}








return(

<div className="min-h-screen bg-green-50 p-5">


<div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-6">



<button

onClick={back}

className="bg-gray-200 px-4 py-2 rounded-xl"

>

← Back

</button>





<h1 className="text-2xl font-bold text-green-700 mt-5">

✅ Confirm Booking

</h1>






<div className="bg-green-100 rounded-2xl p-5 mt-5">



<p>
🚜 Service:
<b>
{" "}
{bookingData?.selectedService?.name}
</b>
</p>




<p className="mt-2">
🌾 Acres:
<b>
{" "}
{bookingData?.acres}
</b>
</p>





<p className="mt-2">
📍 Farm:
<b>
{" "}
{bookingData?.selKhet?.name}
</b>
</p>





<p className="mt-2">
📅 Date:
<b>
{" "}
{bookingData?.date}
</b>
</p>





<p className="mt-2">
💰 Rate:
<b>
{" "}
₹{rate}/Acre
</b>
</p>





<h2 className="text-3xl font-bold mt-5 text-green-700">

₹{amount}

</h2>




</div>






<button

onClick={handleConfirm}

disabled={loading}

className="w-full bg-green-600 text-white p-4 rounded-2xl mt-6 font-bold"

>

{

loading
?
"Creating..."
:
"🚜 Confirm Booking"

}


</button>





</div>


</div>

);


}
