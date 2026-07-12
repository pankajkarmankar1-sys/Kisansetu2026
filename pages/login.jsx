import { useRouter } from "next/router";
import OTPLogin from "../components/customer/OTPLogin";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const router = useRouter();


  async function handleSuccess() {

    try {

      const {
        data:{ user }
      } = await supabase.auth.getUser();


      if(!user){
        router.replace("/login");
        return;
      }


      const {
        data: profile,
        error
      } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("auth_user_id", user.id)
        .maybeSingle();



      if(error){
        console.log(error);
      }



      if(!profile){

        router.replace(
          `/registration?phone=${user.phone || ""}`
        );

        return;

      }



      if(profile.role === "admin"){

        router.replace("/admin");
        return;

      }



      if(profile.role === "driver"){

        router.replace("/driver");
        return;

      }



      if(profile.role === "farmer"){

        router.replace("/dashboard");
        return;

      }



      router.replace("/dashboard");


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
