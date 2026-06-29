export function calculateAmount(acres, rate) {
  return Number(acres) * Number(rate);
}

export function paymentSuccess() {
  return {
    status: "Paid",
    success: true,
  };
}

export function paymentFailed() {
  return {
    status: "Failed",
    success: false,
  };
}
