import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Profile from "../components/customer/Profile";
import { supabase } from "../lib/supabase";


export default function ProfilePage(){

const router = useRouter();

const [user,setUser]=useState(null);
const [loading,setLoading]=useState(true);



useEffect(()=>{

loadProfile();

},[]);



async function loadProfile(){


const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

router.replace("/login");
return;

}



const {
data:profile
}=await supabase

.from("profiles")

.select("*")

.eq(
"auth_user_id",
user.id
)

.maybeSingle();



setUser({

id:user.id,

phone:user.phone,

...profile

});



setLoading(false);


}



if(loading){

return <div className="p-5">
Loading...
</div>

}



return (

<Profile

user={user}

back={()=>router.back()}

/>

);


}
