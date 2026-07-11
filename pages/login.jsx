import { useRouter } from "next/router";
import OTPLogin from "../components/customer/OTPLogin";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const router = useRouter();


  async function handleSuccess() {

    try {


      const selectedRole =
        localStorage.getItem("role");


      const {
        data:{ user }
      } =
      await supabase.auth.getUser();



      if(!user){

        router.replace("/login");
        return;

      }



      const {
        data:profile
      } =
      await supabase

      .from("profiles")

      .select("name, role")

      .eq(
        "auth_user_id",
        user.id
      )

      .maybeSingle();





      if(!profile || !profile.name){

        router.replace(
          `/registration?phone=${user.phone || ""}`
        );

        return;

      }





      // TESTING ROLE LOGIN

      if(selectedRole === "admin"){

        router.replace("/admin");
        return;

      }



      if(selectedRole === "driver"){

        router.replace("/driver");
        return;

      }



      // Farmer

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
