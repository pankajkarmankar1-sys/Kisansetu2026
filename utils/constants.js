// ================================
// KisanSetu Global Constants
// ================================

// App
export const APP_NAME = "KisanSetu";
export const APP_VERSION = "2.0.0";

// Roles
export const USER_ROLE = {
  CUSTOMER: "customer",
  DRIVER: "driver",
  ADMIN: "admin",
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Driver Status
export const DRIVER_STATUS = {
  AVAILABLE: "Available",
  BUSY: "Busy",
  OFFLINE: "Offline",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

// Tractor Services
export const SERVICES = [
  {
    id: "rotavator",
    name: "Rotavator",
    price: 710,
    icon: "🚜",
  },
  {
    id: "cultivator",
    name: "Cultivator",
    price: 410,
    icon: "🌱",
  },
  {
    id: "bedmaker",
    name: "Bed Maker",
    price: 610,
    icon: "🛠️",
  },
  {
    id: "plough",
    name: "Plough",
    price: 810,
    icon: "🚜",
  },
];

// Admin
export const ADMIN_PASSWORD = "kisan2025";

// Currency
export const CURRENCY = "₹";
