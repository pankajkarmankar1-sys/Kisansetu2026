import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Loading KisanSetu...</h2>
    </div>
  );
}
