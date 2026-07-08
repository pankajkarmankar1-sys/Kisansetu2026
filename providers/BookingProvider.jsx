"use client";

import { useState } from "react";
import { BookingContext } from "../context/BookingContext";


export default function BookingProvider({
  children
}) {

  const [booking, setBooking] = useState(null);


  const clearBooking = () => {
    setBooking(null);
  };


  return (

    <BookingContext.Provider
      value={{
        booking,
        setBooking,
        clearBooking,
      }}
    >

      {children}

    </BookingContext.Provider>

  );

}
