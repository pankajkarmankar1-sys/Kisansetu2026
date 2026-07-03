import Head from "next/head";
import LocationSelector from "../components/LocationSelector";

export default function Page() {
  return (
    <>
      <Head>
        <title>KisanSetu</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="theme-color" content="#16a34a" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          padding: 20,
          background: "linear-gradient(135deg,#14532d,#16a34a)",
          color: "white",
        }}
      >
        <h1>🚜 KisanSetu</h1>

        <LocationSelector
          onSelect={(data) => {
            console.log("Selected Location:", data);
          }}
        />
      </div>
    </>
  );
}
