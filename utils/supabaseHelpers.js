// =====================================
// Supabase Helper Functions
// =====================================

export function formatPhone(phone) {
  if (!phone) return "";
  return phone.replace(/\D/g, "").slice(-10);
}

export function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function generateId(prefix = "KS") {
  return (
    prefix +
    "_" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
}

export function getCurrentDate() {
  return new Date().toISOString();
}

export function getToday() {
  return new Date().toLocaleDateString("en-IN");
}

export function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN");
}

export function bookingStatusColor(status) {
  switch (status) {
    case "Pending":
      return "#f59e0b";

    case "Accepted":
      return "#2563eb";

    case "Ongoing":
      return "#7c3aed";

    case "Completed":
      return "#16a34a";

    case "Cancelled":
      return "#dc2626";

    default:
      return "#6b7280";
  }
}

export function driverStatusColor(status) {
  switch (status) {
    case "Available":
      return "#16a34a";

    case "Busy":
      return "#f59e0b";

    case "Offline":
      return "#6b7280";

    default:
      return "#6b7280";
  }
}

export function calculateAmount(acres, rate) {
  return Number(acres || 0) * Number(rate || 0);
}
