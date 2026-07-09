import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "../components/customer/Dashboard";
import { supabase } from "../lib/supabase";


export default function DashboardPage() {


  const router = useRouter();


  const [user,setUser] = useState(null);

  const [loading,setLoading] = useState(true);





  useEffect(()=>{

    loadUser();

  },[]);







  async function loadUser(){


    try{


      const {

        data:{
          user

        }

      } = await supabase.auth.getUser();





      if(!user){

        router.replace("/login");

        return;

      }





      const {
  data: profile,
  error: profileError,
} = await supabase
  .from("profiles")
  .select(`
    name,
    phone,
    document_status,
    aadhaar_front,
    aadhaar_back,
    satbara_7_12,
    state,
    district,
    taluka,
    village,
    farm_address,
    acres
  `)
  .eq("auth_user_id", user.id)
  .maybeSingle();

if (profileError) {
  console.log(profileError);
}







      setUser({


        id:user.id,



        name:

          profile?.name ||

          "Kisan",




        phone:

          profile?.phone ||

          user.phone,





        document_status:

          profile?.document_status ||

          "pending",




        aadhaar_front:

          profile?.aadhaar_front ||

          null,




        aadhaar_back:

          profile?.aadhaar_back ||

          null,




        satbara_7_12:

          profile?.satbara_7_12 ||

          null,


      });




    }

    catch(err){


      console.log(err);


    }

    finally{


      setLoading(false);


    }


  }







  async function logout(){


    await supabase.auth.signOut();


    router.replace("/");


  }







  if(loading){


    return <h2>Loading...</h2>;


  }








  return (


    <Dashboard


      user={user}





      onBook={()=>{


        if(
          user?.document_status !== "approved"
        ){


          alert(

            "Documents approval ke baad booking open hogi"

          );


          return;

        }




        router.push("/book");


      }}







      onSubscription={()=>


        router.push("/subscription")

      }







      onBookings={()=>


        router.push("/bookings")

      }







      onProfile={()=>


        router.push("/profile")

      }







      onNotifications={()=>


        router.push("/notifications")

      }







      onLogout={logout}



    />


  );


}
