import defaultDB from "../data/defaultDB";

export function createBooking(data) {
  defaultDB.bookings.push(data);
}

export function getBookings() {
  return defaultDB.bookings;
}

export function updateBooking(id, values) {
  const booking = defaultDB.bookings.find((b) => b.id === id);

  if (!booking) return;

  Object.assign(booking, values);
}

export function deleteBooking(id) {
  defaultDB.bookings = defaultDB.bookings.filter(
    (b) => b.id !== id
  );
}
