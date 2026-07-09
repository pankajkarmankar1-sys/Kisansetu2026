import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";


export default function DriverLogin(){


  const router = useRouter();


  const [phone,setPhone] = useState("");

  const [loading,setLoading] = useState(false);






  async function sendOTP(){


    try{


      if(!phone){

        alert(
          "Mobile number enter karo"
        );

        return;

      }





      setLoading(true);





      const {

        error

      } = await supabase.auth.signInWithOtp({

        phone: `+91${phone}`

      });






      if(error)
        throw error;






      localStorage.setItem(
        "driver_phone",
        phone
      );





      alert(
        "OTP sent"
      );



      router.push(
        `/driver/verify?phone=${phone}`
      );




    }
    catch(err){


      alert(
        err.message
      );


    }
    finally{


      setLoading(false);


    }


  }







  return (

    <div

      style={{

        padding:20

      }}

    >



      <h1>
        🚜 Driver Login
      </h1>




      <input

        placeholder="Mobile Number"

        value={phone}

        onChange={(e)=>
          setPhone(e.target.value)
        }

        style={{

          width:"100%",

          padding:12

        }}

      />






      <button

        onClick={sendOTP}

        disabled={loading}

        style={{

          marginTop:20,

          width:"100%",

          padding:14,

          background:"#16a34a",

          color:"#fff",

          border:"none"

        }}

      >

        {
          loading
          ?
          "Sending..."
          :
          "Send OTP"
        }

      </button>



    </div>

  );

}
