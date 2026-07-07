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
    (selectedService?.normalPrice || 0) *
    Number(acres || 0);

  return (
    <div
      style={{
        padding: 20,
        background: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <h2>💳 Payment Summary</h2>

      <div
        style={{
          background: "#fff",
          padding: 15,
          borderRadius: 12,
        }}
      >
        <p>
          🚜 Service:
          {" "}
          {selectedService?.name || "-"}
        </p>

        <p>
          🌾 Acres:
          {" "}
          {acres || 0}
        </p>

        <p>
          💰 Amount:
          {" "}
          ₹{amount}
        </p>

        <p>
          Status:
          {" "}
          {paymentDone ? "✅ Paid" : "⏳ Pending"}
        </p>
      </div>

      {!paymentDone ? (
        <button
          onClick={() => setPaymentDone(true)}
          style={{
            marginTop: 20,
            padding: 12,
            width: "100%",
          }}
        >
          💳 Pay Now
        </button>
      ) : (
        <button
          onClick={next}
          style={{
            marginTop: 20,
            padding: 12,
            width: "100%",
          }}
        >
          Continue →
        </button>
      )}

      <button
        onClick={back}
        style={{
          marginTop: 15,
          padding: 12,
          width: "100%",
        }}
      >
        ← Back
      </button>
    </div>
  );
}
