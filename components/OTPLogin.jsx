import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function OTPLogin({ onSuccess }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function sendOTP() {
    if (phone.length !== 10) {
      setMsg("Enter valid mobile number");
      return;
    }

    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      phone: "+91" + phone,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
    } else {
      setStep(2);
      setMsg("OTP Sent Successfully");
    }
  }

  async function verifyOTP() {
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      phone: "+91" + phone,
      token: otp,
      type: "sms",
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Login Success");
      if (onSuccess) onSuccess();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>KisanSetu Login</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Mobile Number"
            value={phone}
            maxLength={10}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
          />

          <br />
          <br />

          <button onClick={sendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
          />

          <br />
          <br />

          <button onClick={verifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      <p>{msg}</p>
    </div>
  );
}
