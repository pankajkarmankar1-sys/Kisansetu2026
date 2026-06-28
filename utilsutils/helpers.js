// Format Date
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN");
};

// Format Time
export const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("en-IN");
};

// Currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Phone
export const cleanPhone = (phone) => {
  return phone.replace(/\D/g, "");
};

// File Size
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) {
    return kb.toFixed(1) + " KB";
  }

  return (kb / 1024).toFixed(1) + " MB";
};
