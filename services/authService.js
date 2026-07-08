// services/authService.js

import { formatPhone } from "../utils/supabaseHelpers";


export async function sendOTP(phone) {

  const mobile = formatPhone(phone);

  if (!mobile) {
    return {
      success: false,
      message: "Phone number required",
    };
  }


  console.log(
    "Sending OTP to:",
    mobile
  );


  // TODO:
  // Supabase Auth OTP integration


  return {
    success: true,
    message: "OTP Sent Successfully",
  };

}



export async function verifyOTP(phone, otp) {

  const mobile = formatPhone(phone);


  if (!mobile || !otp) {
    return {
      success: false,
      message: "Phone and OTP required",
    };
  }


  console.log(
    "Verify OTP:",
    mobile
  );


  // Development Test OTP
  if (otp === "123456") {

    return {
      success: true,
      message: "OTP Verified",
    };

  }


  return {
    success: false,
    message: "Invalid OTP",
  };

}
