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
name:"🌱 Rotavator",
price:1200
},

{
name:"🚜 Cultivator",
price:1000
},

{
name:"🌾 Plough",
price:1500
},

{
name:"🌿 Sowing Service",
price:1800
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




<div className="bg-white rounded-3xl shadow p-6">


<h1 className="text-2xl font-bold text-green-700">

Select Service 🚜

</h1>





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


<h2 className="text-xl font-bold">

{service.name}

</h2>


<p className="mt-2">

Normal Rate: ₹{service.price}

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

placeholder="Enter acre"

className="w-full p-4 border rounded-xl mt-2"

/>






<button

onClick={()=>{

if(!selectedService){

alert("Select service");

return;

}


if(!acres){

alert("Enter acre");

return;

}


next();

}}

className="w-full mt-6 bg-green-600 text-white p-4 rounded-2xl font-bold"

>

Continue

</button>



</div>


</div>


</div>


);

}
