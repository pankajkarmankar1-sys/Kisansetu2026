import { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function OTPLogin({
  onSuccess
}) {


  const [phone,setPhone] =
    useState("");

  const [otp,setOtp] =
    useState("");

  const [step,setStep] =
    useState(1);

  const [loading,setLoading] =
    useState(false);

  const [msg,setMsg] =
    useState("");





  async function sendOTP(){


    if(phone.length !== 10){

      setMsg(
        "Enter valid mobile number"
      );

      return;

    }





    try{


      setLoading(true);

      setMsg("");



      const {
        error
      } =
      await supabase.auth.signInWithOtp({

        phone:
          "+91" + phone

      });





      if(error)
        throw error;





      setStep(2);


      setMsg(
        "OTP Sent Successfully"
      );



    }
    catch(err){

      setMsg(
        err.message
      );

    }
    finally{

      setLoading(false);

    }


  }









  async function verifyOTP(){


    try{


      setLoading(true);

      setMsg("");




      const {
        error
      } =
      await supabase.auth.verifyOtp({

        phone:
          "+91"+phone,


        token:
          otp,


        type:
          "sms"

      });





      if(error)
        throw error;







      const {
        data:{
          user
        }

      } =
      await supabase.auth.getUser();





      if(!user)
        throw new Error(
          "User not found"
        );









      let {

        data:profile

      } = await supabase


        .from("profiles")


        .select("*")


        .eq(
          "auth_user_id",
          user.id
        )


        .maybeSingle();








      // New user profile create


      if(!profile){


        const {
          data:newProfile,
          error:createError

        } = await supabase


          .from("profiles")


          .insert([{

            auth_user_id:
              user.id,


            phone:
              phone,


            role:
              "farmer",


            document_status:
              "pending"


          }])


          .select()


          .single();





        if(createError)
          throw createError;



        profile =
          newProfile;


      }








      setMsg(
        "Login Success"
      );






      if(onSuccess){

        onSuccess(profile);

      }







    }
    catch(err){


      console.log(err);


      setMsg(
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

        maxWidth:400,

        margin:"40px auto",

        padding:20,

        background:"#fff",

        borderRadius:12,

        boxShadow:
        "0 2px 10px rgba(0,0,0,.1)"

      }}

    >


      <h2
        style={{
          textAlign:"center"
        }}
      >

        🚜 KisanSetu Login

      </h2>







      {
        step===1 &&

        <>


          <input

            placeholder="Mobile Number"


            value={phone}


            maxLength={10}


            onChange={(e)=>
              setPhone(
                e.target.value.replace(/\D/g,"")
              )
            }


            style={{
              width:"100%",
              padding:12,
              marginTop:20
            }}

          />



          <button

            onClick={sendOTP}

            disabled={loading}


            style={{

              width:"100%",

              padding:12,

              marginTop:20,

              background:"#16a34a",

              color:"#fff",

              border:"none",

              borderRadius:8

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


        </>

      }









      {
        step===2 &&

        <>


          <input

            placeholder="Enter OTP"


            value={otp}


            maxLength={6}


            onChange={(e)=>
              setOtp(
                e.target.value.replace(/\D/g,"")
              )
            }


            style={{

              width:"100%",

              padding:12,

              marginTop:20

            }}

          />




          <button

            onClick={verifyOTP}

            disabled={loading}


            style={{

              width:"100%",

              padding:12,

              marginTop:20,

              background:"#16a34a",

              color:"#fff",

              border:"none",

              borderRadius:8

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


        </>

      }






      {
        msg &&

        <p
          style={{
            marginTop:20,
            textAlign:"center"
          }}
        >

          {msg}

        </p>

      }



    </div>

  );

}
