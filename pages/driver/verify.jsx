import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";


export default function DriverVerify(){


  const router = useRouter();


  const [otp,setOtp] = useState("");

  const [loading,setLoading] = useState(false);






  async function verifyOTP(){


    try{


      const phone =
        router.query.phone ||
        localStorage.getItem(
          "driver_phone"
        );





      if(!phone){

        alert(
          "Phone missing"
        );

        return;

      }






      setLoading(true);






      const {

        data,

        error

      } = await supabase.auth.verifyOtp({

        phone:`+91${phone}`,

        token:otp,

        type:"sms"

      });






      if(error)
        throw error;







      const user =
        data.user;






      const {

        data:profile

      } = await supabase

      .from("profiles")

      .select("*")

      .eq(

        "auth_user_id",

        user.id

      )

      .maybeSingle();







      if(!profile){


        router.push(
          "/driver/register"
        );


        return;


      }







      if(profile.role !== "driver"){


        alert(
          "Driver account nahi hai"
        );


        return;


      }







      router.push(
        "/driver"
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
        🔐 Verify Driver OTP
      </h1>




      <input

        placeholder="Enter OTP"

        value={otp}

        onChange={(e)=>
          setOtp(e.target.value)
        }

        style={{

          width:"100%",

          padding:12

        }}

      />





      <button

        onClick={verifyOTP}

        disabled={loading}

        style={{

          marginTop:20,

          width:"100%",

          padding:14,

          background:"#16a34a",

          color:"#fff"

        }}

      >

        {
          loading
          ?
          "Verifying..."
          :
          "Verify OTP"
        }

      </button>



    </div>

  );

}
