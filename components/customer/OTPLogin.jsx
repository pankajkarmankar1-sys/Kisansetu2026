import { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function OTPLogin({
  onSuccess
}) {


const [phone,setPhone]=useState("");
const [otp,setOtp]=useState("");
const [step,setStep]=useState(1);
const [loading,setLoading]=useState(false);
const [msg,setMsg]=useState("");



function getFullPhone(){

if(phone.startsWith("+"))
return phone;

if(phone.startsWith("91"))
return "+"+phone;

return "+91"+phone;

}





async function sendOTP(){


if(phone.length < 10){

setMsg("Enter valid mobile number");
return;

}


try{

setLoading(true);
setMsg("");


const {error}=await supabase.auth.signInWithOtp({

phone:getFullPhone(),

options:{
channel:"sms"
}

});


if(error)
throw error;


setStep(2);

setMsg("OTP sent successfully");


}

catch(err){

setMsg(err.message);

}

finally{

setLoading(false);

}

}





async function verifyOTP(){

try{

setLoading(true);
setMsg("");


const {error}=await supabase.auth.verifyOtp({

phone:getFullPhone(),

token:otp,

type:"sms"

});


if(error)
throw error;



const {
data:{user}
}=await supabase.auth.getUser();



if(!user)
throw new Error("User not found");



let {data:profile}=await supabase

.from("profiles")

.select("*")

.eq("auth_user_id",user.id)

.maybeSingle();



if(!profile){


const {data:newProfile,error:createError}=

await supabase

.from("profiles")

.insert([{

auth_user_id:user.id,

phone:getFullPhone(),

role:"farmer",

document_status:"pending"

}])

.select()

.single();



if(createError)
throw createError;


profile=newProfile;


}



setMsg("Login Success");


onSuccess && onSuccess(profile);



}

catch(err){

setMsg(err.message);

}

finally{

setLoading(false);

}

}




return (

<div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex items-center justify-center p-5">


<div className="w-full max-w-md">


{/* BRAND */}

<div className="text-center mb-6">


<div className="text-6xl">
🌱
</div>


<h1 className="text-4xl font-extrabold text-green-700">
KisanSetu
</h1>


<p className="text-gray-600 mt-2">
Smart Farming Service Platform
</p>


</div>





<div className="bg-white rounded-3xl shadow-xl p-6">


<h2 className="text-2xl font-bold text-center">

{step===1
?
"Login with Mobile"
:
"Verify OTP"
}

</h2>




<p className="text-center text-gray-500 mt-2">

Secure farmer login

</p>





{
step===1 &&

<>


<input

placeholder="Enter Mobile Number"

value={phone}

maxLength={10}

onChange={(e)=>

setPhone(
e.target.value.replace(/\D/g,"")
)

}

className="w-full mt-6 p-5 rounded-2xl bg-green-50 border text-lg"

/>



<button

onClick={sendOTP}

disabled={loading}

className="w-full mt-5 bg-green-700 text-white p-5 rounded-2xl font-bold text-lg"

>

{loading?"Sending OTP...":"Send OTP"}

</button>


</>

}





{
step===2 &&

<>


<input

placeholder="Enter 6 Digit OTP"

value={otp}

maxLength={6}

onChange={(e)=>

setOtp(
e.target.value.replace(/\D/g,"")
)

}

className="w-full mt-6 p-5 rounded-2xl bg-green-50 border text-center text-xl tracking-widest"

/>



<button

onClick={verifyOTP}

disabled={loading}

className="w-full mt-5 bg-green-700 text-white p-5 rounded-2xl font-bold text-lg"

>

{loading?"Checking...":"Verify OTP"}

</button>


</>

}





{
msg &&

<p className="mt-5 text-center text-sm text-green-700">

{msg}

</p>

}



</div>



</div>


</div>

);

}
