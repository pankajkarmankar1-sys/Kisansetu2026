"use client";

import { BookingContext } from "../context/BookingContext";

export default function BookingProvider({ children }) {
  return (
    <BookingContext.Provider value={{}}>
      {children}
    </BookingContext.Provider>
  );
}
