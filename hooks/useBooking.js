import { useState } from "react";

export default function useBooking() {
  const [bookings, setBookings] = useState([]);

  function addBooking(data) {
    setBookings((prev) => [...prev, data]);
  }

  function removeBooking(id) {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  return {
    bookings,
    addBooking,
    removeBooking,
  };
}
