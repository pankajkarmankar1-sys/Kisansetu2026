import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";


export default function SubscriptionPage(){

const router = useRouter();

const [acres,setAcres] = useState("");
const [loading,setLoading] = useState(false);



async function buySubscription(){

try{

setLoading(true);


const {
 data:{
  user
 }
}= await supabase.auth.getUser();



if(!user){

alert("Login required");
return;

}



if(!acres || Number(acres)<=0){

alert("Enter acres");
return;

}



const amount =
Number(acres) * 550;



const {
error
}= await supabase
.from("subscriptions")
.insert({

user_id:user.id,

acres:Number(acres),

amount,

status:"active",

start_date:new Date()

});



if(error)
throw error;



alert(
"✅ Subscription Activated"
);



router.replace("/dashboard");



}
catch(err){

alert(err.message);

}
finally{

setLoading(false);

}


}




return(

<div className="min-h-screen bg-green-50 p-5">


<div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6">


<div className="text-center">


<div className="text-5xl">
👑
</div>


<h1 className="text-3xl font-bold text-green-700 mt-3">
KisanSetu Subscription
</h1>


<p className="mt-2 text-gray-600">
Special Farmer Discount Plan
</p>


</div>





<div className="mt-6 bg-orange-500 text-white rounded-3xl p-6">


<h2 className="text-3xl font-bold">
🔥 50% OFF
</h2>


<p className="text-xl mt-2">
₹550 / Acre / Year
</p>


<p className="mt-2">
Subscription active hone ke baad ye discount expiry tak milega.
</p>


</div>






<label className="block mt-6 font-bold">
Your Farm Acre
</label>


<input

type="number"

value={acres}

onChange={(e)=>setAcres(e.target.value)}

placeholder="Enter acres"

className="w-full border p-4 rounded-xl mt-2"

/>





<button

onClick={buySubscription}

disabled={loading}

className="w-full mt-6 bg-green-600 text-white p-4 rounded-2xl font-bold text-lg"

>

{
loading
?
"Processing..."
:
"Activate Subscription"
}

</button>



</div>


</div>

);


}
