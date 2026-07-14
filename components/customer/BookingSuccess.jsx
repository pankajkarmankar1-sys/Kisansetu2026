import React from "react";


export default function BookingSuccess({
  bookingData,
  onDone,
}) {


return(

<div className="min-h-screen bg-green-50 p-5">


<div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-6 text-center">



<div className="text-7xl">
🎉
</div>



<h1 className="text-3xl font-bold text-green-700 mt-4">

Booking Confirmed

</h1>




<p className="text-gray-600 mt-3">

Aapki KisanSetu service booking successfully create ho gayi hai.

</p>







<div className="bg-green-50 rounded-3xl p-5 mt-6 text-left">



<p>
🚜 <b>Service:</b>

{" "}

{
bookingData?.service_name ||
bookingData?.selectedService?.name ||
"-"
}

</p>





<p className="mt-3">

🌾 <b>Area:</b>

{" "}

{bookingData?.acres || 0} Acre

</p>






<p className="mt-3">

💰 <b>Total Amount:</b>

{" "}

₹{bookingData?.amount || 0}

</p>






<p className="mt-3">

📅 <b>Date:</b>

{" "}

{
bookingData?.booking_date ||
bookingData?.date ||
"-"
}

</p>







<p className="mt-3">

📍 <b>Farm:</b>

{" "}

{
bookingData?.farm_name ||
bookingData?.selKhet?.name ||
"-"
}

</p>







<p className="mt-3">

👤 <b>Customer:</b>

{" "}

{
bookingData?.customer_name ||
"Kisan"
}

</p>







<p className="mt-3">

💳 <b>Payment:</b>

{" "}

{
bookingData?.payment_status ||
"Paid"
}

</p>






<p className="mt-3 font-bold text-green-700">

📌 Status: Pending Driver Assignment

</p>



</div>








<button

onClick={onDone}

className="w-full bg-green-600 text-white p-4 rounded-2xl mt-6 font-bold text-lg"

>

🏠 Go Home

</button>





</div>


</div>


);


}
