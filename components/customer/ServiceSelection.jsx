import React from "react";


export default function ServiceSelection({

  selectedService,
  setSelectedService,
  acres,
  setAcres,
  next,
  back,

}) {



const services=[


{
name:"🌾 कश्या निकालना & जमा करना",
normal:820,
subscription:410
},


{
name:"🌱 पंजी मारना",
normal:820,
subscription:410
},


{
name:"🌿 फास मारना",
normal:820,
subscription:410
},


{
name:"🚜 नागर्णी",
normal:1620,
subscription:810
},


{
name:"🌱 कल्टीवेटर",
normal:820,
subscription:410
},


{
name:"🌾 बेड मेकर",
normal:1220,
subscription:610
},


{
name:"🚜 रोटावेटर",
normal:1420,
subscription:710
}



];






return(

<div className="min-h-screen bg-green-50 p-5">


<div className="max-w-xl mx-auto">



<button

onClick={back}

className="mb-4 bg-white px-4 py-2 rounded-xl shadow"

>

← Back

</button>






<div className="bg-white rounded-3xl shadow-xl p-6">



<h1 className="text-2xl font-bold text-green-700">

Select Farm Service 🌾

</h1>




<p className="text-gray-500 mt-2">

Choose service for your farm

</p>





<div className="grid gap-4 mt-5">



{

services.map((service)=>(


<button

key={service.name}

onClick={()=>setSelectedService(service)}


className={

"p-5 rounded-2xl text-left shadow border " +

(selectedService?.name===service.name

?

"bg-green-100 border-green-600"

:

"bg-white")

}


>


<h2 className="text-lg font-bold text-green-700">

{service.name}

</h2>




<p className="mt-2 text-gray-700">

Normal Rate: ₹{service.normal}/ Acre

</p>



<p className="text-green-600 font-bold">

Subscription Rate: ₹{service.subscription}/ Acre

</p>



</button>


))

}



</div>








<label className="block mt-6 font-bold">

Area (Acre)

</label>




<input

type="number"

value={acres}

onChange={(e)=>setAcres(e.target.value)}

placeholder="Enter farm area"

className="w-full p-4 border rounded-xl mt-2"

/>







<button

onClick={()=>{


if(!selectedService){

alert("Please select service");

return;

}



if(!acres){

alert("Please enter acre");

return;

}



next();



}}


className="w-full mt-6 bg-green-600 text-white p-4 rounded-2xl font-bold shadow-lg"

>


Continue →

</button>





</div>



</div>


</div>


);


}
