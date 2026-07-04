import React from "react";

export default function PaymentSummary({
  selectedService,
  acres,
  paymentDone,
  setPaymentDone,
  next,
  back,
}) {
  const amount =
    (Number(selectedService?.price || 0) * Number(acres || 0)).toFixed(2);

  const handlePayment = () => {
    alert("✅ Payment Successful");
    setPaymentDone(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💳 Payment Summary</h2>

      <p>🚜 Service: {selectedService?.name}</p>

      <p>🌾 Acres: {acres}</p>

      <p>💰 Amount: ₹{amount}</p>

      {!paymentDone ? (
        <button onClick={handlePayment}>
          Pay Now
        </button>
      ) : (
        <button onClick={next}>
          Continue
        </button>
      )}

      <br />
      <br />

      <button onClick={back}>
        ← Back
      </button>
    </div>
  );
}
