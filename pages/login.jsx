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

    if (!profile || !profile.name) {

      const phone =
        profile?.phone || "";

      router.replace(
        `/registration?phone=${phone}`
      );

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
