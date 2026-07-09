import { useRouter } from "next/router";
import OTPLogin from "../components/customer/OTPLogin";

export default function LoginPage() {
  const router = useRouter();

  function handleSuccess(profile) {

    const role = localStorage.getItem("role");

    if (role === "admin") {
      router.replace("/admin");
      return;
    }

    if (role === "driver") {
      router.replace("/driver");
      return;
    }

    // Farmer

    if (!profile || !profile.name || profile.name === "Kisan") {
      router.replace("/registration");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <OTPLogin
      onSuccess={handleSuccess}
    />
  );
}
