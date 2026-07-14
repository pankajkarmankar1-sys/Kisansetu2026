import React from "react";


export default function PaymentSummary({

  selectedService,
  acres,
  paymentDone,
  setPaymentDone,
  next,
  back,
  user,

}) {


const area = Number(acres || 0);



const subscriptionActive =
user?.subscription_status === "active";




const rate = subscriptionActive
?
selectedService?.subscription
:
selectedService?.normal;




const totalAmount =
area * Number(rate || 0);






return(

<div className="min-h-screen bg-green-50 p-5">


<div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-6">



<button

onClick={back}

className="bg-white shadow px-4 py-2 rounded-xl"

>

← Back

</button>





<h1 className="text-2xl font-bold text-green-700 mt-5">

Payment Summary 💳

</h1>







<div className="mt-5 bg-green-50 rounded-2xl p-5">


<p>

Service:

<b className="ml-2">

{selectedService?.name}

</b>

</p>





<p className="mt-3">

Area:

<b className="ml-2">

{acres} Acre

</b>

</p>






<p className="mt-3">

Rate:

<b className="ml-2">

₹{rate}/ Acre

</b>

</p>






<h2 className="text-2xl font-bold text-green-700 mt-5">

Total: ₹{totalAmount}

</h2>







{
subscriptionActive &&

<p className="text-green-600 font-bold mt-3">

✅ Subscription Price Applied

</p>

}



</div>







<button

onClick={()=>{


setPaymentDone(true);


alert("Payment Successful ✅");


next();


}}


className="w-full mt-6 bg-green-600 text-white p-4 rounded-2xl font-bold"

>


{

paymentDone

?

"Continue"

:

"Pay Now"

}



</button>





</div>


</div>


);


}
