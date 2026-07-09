import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {

  const router = useRouter();


  function selectRole(role){

    localStorage.setItem(
      "role",
      role
    );


    if(role==="farmer"){

      router.push("/login");

    }


    if(role==="driver"){

      router.push("/driver");

    }


    if(role==="admin"){

      router.push("/admin");

    }

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

          background:"linear-gradient(135deg,#14532d,#16a34a)",

          color:"white",

          textAlign:"center"

        }}

      >



        <h1>
          🚜 KisanSetu
        </h1>


        <p>
          Select Login Type
        </p>




        <button

          onClick={()=>selectRole("farmer")}

          style={btn}

        >

          👨‍🌾 Farmer

        </button>





        <button

          onClick={()=>selectRole("driver")}

          style={btn}

        >

          🚜 Driver

        </button>





        <button

          onClick={()=>selectRole("admin")}

          style={btn}

        >

          👨‍💼 Admin

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
