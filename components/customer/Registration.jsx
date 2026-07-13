import { useState } from "react";
import { supabase } from "../../lib/supabase";
import LocationSelector from "../maps/LocationSelector";


export default function Registration({
  phone,
  onDone,
  back,
}) {


const [name,setName]=useState("");
const [farmAddress,setFarmAddress]=useState("");
const [acres,setAcres]=useState("");
const [role,setRole]=useState("farmer");
const [location,setLocation]=useState(null);
const [loading,setLoading]=useState(false);
const [error,setError]=useState("");



async function handleSubmit(e){

e.preventDefault();

setError("");

if(!name){
setError("Please enter your name");
return;
}


if(!location){
setError("Please select farm location");
return;
}



try{

setLoading(true);


const {data:{user}} =
await supabase.auth.getUser();



if(!user)
throw new Error("Login expired");



const {error}=await supabase
.from("profiles")
.upsert({

auth_user_id:user.id,

phone:phone || user.phone,

role,

name,

farm_address:farmAddress,

acres:Number(acres||0),

village:location.village || "",

state:location.state || "",

district:location.district || "",

taluka:location.taluka || "",

latitude:location.latitude || location.lat || null,

longitude:location.longitude || location.lng || null,

document_status:"pending"

},
{
onConflict:"auth_user_id"
});



if(error)
throw error;



alert("✅ Registration Complete");


onDone && onDone();


}

catch(err){

setError(err.message);

}

finally{

setLoading(false);

}

}




return (

<div className="min-h-screen bg-green-50 p-4">


<div className="max-w-md mx-auto">


{/* HEADER */}

<div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white rounded-3xl p-6 shadow-xl">


<div className="text-5xl">
🌱
</div>


<h1 className="text-3xl font-extrabold mt-3">
KisanSetu
</h1>


<p className="mt-2">
Create your farmer profile
</p>


</div>





<form
onSubmit={handleSubmit}
className="mt-5 space-y-5"
>





{/* ROLE */}

<div className="bg-white rounded-3xl p-5 shadow">


<h2 className="font-bold text-lg mb-3">
Choose Account Type
</h2>


<div className="grid grid-cols-3 gap-2">


{
[
["farmer","👨‍🌾","Farmer"],
["driver","🚜","Driver"],
["admin","🛠","Admin"]

].map((item)=>(


<button

type="button"

key={item[0]}

onClick={()=>setRole(item[0])}

className={

role===item[0]

?
"bg-green-600 text-white rounded-2xl p-3"

:

"bg-green-50 rounded-2xl p-3"

}

>

<div>
{item[1]}
</div>

<div className="text-xs">
{item[2]}
</div>


</button>


))

}


</div>


</div>





{/* DETAILS */}

<div className="bg-white rounded-3xl p-5 shadow">


<h2 className="font-bold text-lg mb-3">
👤 Personal Details
</h2>



<input

placeholder="Full Name"

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full p-4 rounded-2xl bg-gray-50 border mb-3"

/>




<input

placeholder="Farm Address"

value={farmAddress}

onChange={(e)=>setFarmAddress(e.target.value)}

className="w-full p-4 rounded-2xl bg-gray-50 border mb-3"

/>



<input

type="number"

placeholder="Farm Area (Acres)"

value={acres}

onChange={(e)=>setAcres(e.target.value)}

className="w-full p-4 rounded-2xl bg-gray-50 border"

/>


</div>






{/* LOCATION */}

<div className="bg-white rounded-3xl p-5 shadow">


<h2 className="font-bold text-lg mb-3">
📍 Farm Location
</h2>


<LocationSelector

onSelect={(data)=>setLocation(data)}

/>


</div>






{
error &&

<div className="bg-red-100 text-red-600 p-3 rounded-xl">

{error}

</div>

}





<button

disabled={loading}

className="w-full bg-green-700 text-white p-5 rounded-3xl font-bold text-lg shadow-xl"

>

{

loading
?
"Saving..."
:
"✅ Complete Registration"

}


</button>





{
back &&

<button

type="button"

onClick={back}

className="w-full bg-white p-4 rounded-3xl font-bold shadow"

>

← Back

</button>

}


</form>


</div>


</div>


);

}
