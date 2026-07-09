import { useRouter } from "next/router";
import OTPLogin from "../components/customer/OTPLogin";
import { supabase } from "../lib/supabase";


export default function LoginPage() {


  const router = useRouter();




  async function handleSuccess(profile){


    try{


      const role =
        localStorage.getItem("role");



      const {
        data:{
          user
        }
      } =
      await supabase.auth.getUser();





      if(!user){

        router.replace("/login");

        return;

      }






      const {
        data:userProfile
      } = await supabase

        .from("profiles")

        .select("*")

        .eq(
          "auth_user_id",
          user.id
        )

        .maybeSingle();







      // Admin

      if(role==="admin"){

        router.replace("/admin");

        return;

      }







      // Driver

      if(role==="driver"){

        router.replace("/driver");

        return;

      }








      // Farmer new user

      if(
        !userProfile ||
        !userProfile.name
      ){


        router.replace(

          `/registration?phone=${user.phone || ""}`

        );


        return;

      }







      // Farmer existing user

      router.replace(
        "/dashboard"
      );





    }
    catch(err){

      console.log(err);

    }


  }







  return (

    <OTPLogin

      onSuccess={handleSuccess}

    />

  );

}
