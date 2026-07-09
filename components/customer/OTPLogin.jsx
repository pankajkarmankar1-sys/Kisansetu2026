import { useState } from "react";
import { supabase } from "../../lib/supabase";

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

    try {
      setLoading(true);
      setMsg("");

      const { error } = await supabase.auth.signInWithOtp({
        phone: "+91" + phone,
      });

      if (error) {
        throw error;
      }

      setStep(2);
      setMsg("OTP Sent Successfully");

    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    try {
      setLoading(true);
      setMsg("");

      const { error } = await supabase.auth.verifyOtp({
        phone: "+91" + phone,
        token: otp,
        type: "sms",
      });

      if (error) {
        throw error;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not found");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!profile) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              auth_user_id: user.id,
              phone: user.phone,
              role: "kisan",
              name: "Kisan",
            },
          ]);

        if (insertError) {
          throw insertError;
        }
      }

      setMsg("Login Success");

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
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

          <button
            onClick={sendOTP}
            disabled={loading}
          >
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

          <button
            onClick={verifyOTP}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      <br />

      <p>{msg}</p>
    </div>
  );
}
