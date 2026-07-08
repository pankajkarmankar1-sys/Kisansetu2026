// engines/paymentEngine.js

export function calculateAmount(acres, rate) {

  const area = Number(acres || 0);
  const price = Number(rate || 0);

  return Math.round(area * price);

}



export function paymentSuccess(transactionId = null) {

  return {

    status: "Paid",

    success: true,

    transactionId,

    paidAt: new Date().toISOString(),

  };

}



export function paymentFailed(reason = "Payment Failed") {

  return {

    status: "Failed",

    success: false,

    reason,

    failedAt: new Date().toISOString(),

  };

}
