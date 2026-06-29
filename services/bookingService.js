// services/bookingService.js

import { generateId, calculateAmount } from "../utils/supabaseHelpers";

export async function createBooking(data) {
  const booking = {
    id: generateId("BOOK"),
    customer: data.customer,
    phone: data.phone,
    village: data.village,
    service: data.service,
    acres: data.acres,
    rate: data.rate,
    amount: calculateAmount(data.acres, data.rate),
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  console.log("Booking Created", booking);

  return booking;
}

export async function getBookings() {
  console.log("Fetching Bookings");

  return [];
}

export async function updateBooking(id, data) {
  console.log("Update Booking", id, data);

  return {
    success: true,
  };
}

export async function cancelBooking(id) {
  console.log("Cancel Booking", id);

  return {
    success: true,
  };
}
