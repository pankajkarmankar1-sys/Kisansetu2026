import { useRouter } from "next/router";
import OTPLogin from "../components/customer/OTPLogin";

export default function LoginPage() {
  const router = useRouter();

  function handleSuccess() {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      router.replace("/admin");
      return;
    }

    if (role === "driver") {
      router.replace("/driver");
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
