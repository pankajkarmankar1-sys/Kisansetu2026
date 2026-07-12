import { useRouter } from "next/router";
import OTPLogin from "../components/customer/OTPLogin";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  async function handleSuccess() {

    try {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const {
        data: profile,
        error
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (error) {
        console.log(error);
        return;
      }

      if (!profile) {
        router.replace(`/registration?phone=${user.phone || ""}`);
        return;
      }

      const selectedRole = localStorage.getItem("role");

      if (
        selectedRole &&
        profile.role !== selectedRole
      ) {

        alert(
          `This account is registered as ${profile.role}. Please use ${profile.role} Login.`
        );

        await supabase.auth.signOut();
        router.replace("/");
        return;
      }

      switch (profile.role) {

        case "admin":
          router.replace("/admin");
          break;

        case "driver":
          router.replace("/driver");
          break;

        case "farmer":
          router.replace("/dashboard");
          break;

        default:
          router.replace("/");
      }

    } catch (err) {

      console.log(err);

    }

  }

  return (
    <OTPLogin
      onSuccess={handleSuccess}
    />
  );

}
