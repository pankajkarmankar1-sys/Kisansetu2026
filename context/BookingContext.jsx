import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        setBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  return useContext(BookingContext);
}
