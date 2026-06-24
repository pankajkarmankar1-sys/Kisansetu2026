import dynamic from "next/dynamic";
import Head from "next/head";

const App = dynamic(() => import("../components/KisanSetu"), {
  ssr: false,
  loading: () => (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      background:"linear-gradient(135deg,#14532d,#16a34a)"}}>
      <div style={{fontSize:60,marginBottom:16}}>🚜</div>
      <h1 style={{color:"#fff",fontSize:26,fontWeight:900}}>KisanSetu</h1>
      <p style={{color:"rgba(255,255,255,.7)",marginTop:8}}>Loading...</p>
    </div>
  ),
});

export default function Page() {
  return (
    <>
      <Head>
        <title>KisanSetu</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
        <meta name="theme-color" content="#16a34a"/>
        <link rel="icon" href="/favicon.svg"/>
      </Head>
      <App/>
    </>
  );
}
