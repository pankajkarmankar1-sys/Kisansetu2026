import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#F4F7F6",
      }}
    >
      <h1 style={{ color: "#2E7D32" }}>🌾 KisanSetu</h1>
      <p>Loading Dashboard...</p>
    </div>
  );
}
