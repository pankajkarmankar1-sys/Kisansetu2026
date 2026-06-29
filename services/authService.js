// services/authService.js

import { formatPhone } from "../utils/supabaseHelpers";

export async function sendOTP(phone) {
  const mobile = formatPhone(phone);

  console.log("Sending OTP to:", mobile);

  // Future:
  // Supabase Auth OTP
  // Firebase OTP
  // MSG91 API

  return {
    success: true,
    message: "OTP Sent Successfully",
  };
}

export async function verifyOTP(phone, otp) {
  const mobile = formatPhone(phone);

  console.log("Verify OTP", mobile, otp);

  // Future:
  // Supabase Verify OTP

  if (otp === "123456") {
    return {
      success: true,
    };
  }

  return {
    success: false,
    message: "Invalid OTP",
  };
}
