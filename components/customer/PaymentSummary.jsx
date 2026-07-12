import React from "react";


export default function PaymentSummary({

  selectedService,
  acres,
  paymentDone,
  setPaymentDone,
  next,
  back,

}) {


const normalAmount =
Number(acres || 0) *
Number(selectedService?.price || 0);



const subscriptionActive = false;


// Abhi user subscription table se connect karenge
// next step me isko real data se replace karenge


const discount =
subscriptionActive
?
normalAmount * 0.50
:
normalAmount;



return(

<div className="min-h-screen bg-green-50 p-5">


<div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6">



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
{" "}
<b>
{selectedService?.name}
</b>
</p>



<p className="mt-2">

Area:
{" "}
<b>
{acres} Acre
</b>

</p>





<p className="mt-3 text-lg">

Amount:
{" "}

<b>
₹{discount}
</b>

</p>



{
subscriptionActive &&

<p className="text-green-600 font-bold mt-2">

🔥 50% Subscription Discount Applied

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
