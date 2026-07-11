import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {

  const router = useRouter();


  function selectRole(role){

    localStorage.setItem(
      "role",console.log("SELECTED ROLE:", selectedRole);
  
      role
    );

    router.push("/login");

  }



  return (
    <>

      <Head>

        <title>KisanSetu</title>

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />

        <meta
          name="theme-color"
          content="#16a34a"
        />

      </Head>



      <div
        style={{
          minHeight:"100vh",
          padding:20,
          background:"#16a34a",
          color:"#fff",
          textAlign:"center",
          display:"flex",
          flexDirection:"column",
          justifyContent:"center"
        }}
      >

        <h1>
          🚜 KisanSetu
        </h1>


        <h3>
          Select Login Type
        </h3>



        <button
          onClick={()=>selectRole("farmer")}
          style={btn}
        >
          👨‍🌾 Farmer Login
        </button>



        <button
          onClick={()=>selectRole("driver")}
          style={btn}
        >
          🚜 Driver Login
        </button>



        <button
          onClick={()=>selectRole("admin")}
          style={btn}
        >
          👨‍💼 Admin Login
        </button>



      </div>

    </>
  );

}



const btn={

  width:"100%",
  padding:15,
  margin:"10px 0",
  borderRadius:12,
  border:"none",
  fontSize:18,
  cursor:"pointer"

};
