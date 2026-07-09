// services/authService.js

import { supabase } from "../lib/supabase";
import { formatPhone } from "../utils/supabaseHelpers";



export async function sendOTP(phone) {

  const mobile = formatPhone(phone);


  if (!mobile) {

    return {
      success:false,
      message:"Phone number required"
    };

  }



  try {


    const { error } =
      await supabase.auth.signInWithOtp({

        phone: mobile,

        options:{
          channel:"sms"
        }

      });



    if(error){

      throw error;

    }



    return {

      success:true,

      message:"OTP Sent Successfully"

    };



  } catch(err){


    console.log("SEND OTP ERROR:",err);


    return {

      success:false,

      message:err.message

    };


  }

}






export async function verifyOTP(phone, otp) {


  const mobile = formatPhone(phone);



  if(!mobile || !otp){

    return {

      success:false,

      message:"Phone and OTP required"

    };

  }




  try {


    const { error } =

      await supabase.auth.verifyOtp({

        phone:mobile,

        token:otp,

        type:"sms"

      });




    if(error){

      throw error;

    }




    return {

      success:true,

      message:"OTP Verified"

    };



  } catch(err){


    console.log("VERIFY OTP ERROR:",err);



    return {

      success:false,

      message:err.message

    };


  }


}
