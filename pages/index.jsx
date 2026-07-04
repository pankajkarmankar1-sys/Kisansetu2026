import Head from "next/head";
import { useRouter } from "next/router";
import LocationSelector from "../components/LocationSelector";

export default function Home() {
  const router = useRouter();

  const handleLocationSelect = (data) => {
    console.log("Selected Location:", data);

    // Agar chahe to location save bhi kar sakte ho
    localStorage.setItem("userLocation", JSON.stringify(data));

    // Dashboard par jao
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>KisanSetu</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#16a34a" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          padding: "20px",
          background: "linear-gradient(135deg, #14532d, #16a34a)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>🚜 KisanSetu</h1>

        <LocationSelector onSelect={handleLocationSelect} />
      </div>
    </>
  );
}
