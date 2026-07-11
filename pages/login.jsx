import { useRouter } from "next/router";
import OTPLogin from "../components/customer/OTPLogin";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  async function handleSuccess() {

    try {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      // New User
      if (!profile || !profile.name) {
        router.replace(`/registration?phone=${user.phone || ""}`);
        return;
      }

      // Admin
      if (profile.role === "admin") {
        router.replace("/admin");
        return;
      }

      // Driver
      if (profile.role === "driver") {
        router.replace("/driver");
        return;
      }

      // Farmer
      router.replace("/dashboard");

    } catch (err) {
      console.log(err);
    }
  }

  return <OTPLogin onSuccess={handleSuccess} />;
}
