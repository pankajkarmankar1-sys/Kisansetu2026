import React from "react";

export default function PaymentSummary({
  service,
  acres,
  amount,
  paymentDone,
  onPay,
  next,
}) {

  return (
    <div>

      <h2>💳 Payment Summary</h2>

      <p>Service : {service?.n}</p>

      <p>Acres : {acres}</p>

      <p>Amount : ₹{amount}</p>

      {!paymentDone ? (
        <button onClick={onPay}>
          Pay Now
        </button>
      ) : (
        <button onClick={next}>
          Continue
        </button>
      )}

    </div>
  );

}
