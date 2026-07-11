import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("role", "admin");
    router.replace("/login");
  }, []);

  return <h2 style={{ padding: 20 }}>Redirecting to Admin Login...</h2>;
}
