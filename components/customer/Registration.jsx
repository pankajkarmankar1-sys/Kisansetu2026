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
setError("Please select location");
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


if(error) throw error;


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

<div className="min-h-screen bg-gradient-to-b from-green-100 to-white p-5">


<div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6">


<div className="text-center">


<div className="text-5xl">
🌱
</div>


<h1 className="text-3xl font-bold text-green-700 mt-2">
KisanSetu
</h1>


<p className="text-gray-500">
Complete your farmer profile
</p>


</div>



<form onSubmit={handleSubmit}
className="mt-6 space-y-4">


<select

value={role}

onChange={(e)=>setRole(e.target.value)}

className="w-full p-4 rounded-2xl border bg-green-50 font-semibold"

>

<option value="farmer">
👨‍🌾 Farmer
</option>


<option value="driver">
🚜 Driver
</option>


<option value="admin">
🛠 Admin
</option>


</select>




<input

placeholder="Full Name"

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full p-4 rounded-2xl border"

 />



<input

placeholder="Farm Address"

value={farmAddress}

onChange={(e)=>setFarmAddress(e.target.value)}

className="w-full p-4 rounded-2xl border"

/>




<input

type="number"

placeholder="Farm Area (Acres)"

value={acres}

onChange={(e)=>setAcres(e.target.value)}

className="w-full p-4 rounded-2xl border"

/>




<div className="bg-green-50 rounded-2xl p-3">

<p className="font-bold mb-2">
📍 Select Farm Location
</p>

<LocationSelector
onSelect={(data)=>setLocation(data)}
/>

</div>




{
error &&
<p className="text-red-600 text-sm">
{error}
</p>
}



<button

disabled={loading}

className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold text-lg shadow"

>

{
loading
?
"Saving Profile..."
:
"✅ Create Account"
}


</button>



{
back &&
<button

type="button"

onClick={back}

className="w-full bg-gray-200 p-4 rounded-2xl font-bold"

>

← Back

</button>

}



</form>


</div>


</div>

);

}
