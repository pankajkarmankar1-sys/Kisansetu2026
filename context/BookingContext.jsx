// context/BookingContext.js

import {
  createContext,
  useContext,
  useState,
} from "react";


const BookingContext =
  createContext(null);



export function BookingProvider({
  children
}) {

  const [bookings, setBookings] =
    useState([]);


  const [currentBooking, setCurrentBooking] =
    useState(null);


  const [loading, setLoading] =
    useState(false);



  return (

    <BookingContext.Provider

      value={{

        bookings,

        setBookings,


        currentBooking,

        setCurrentBooking,


        loading,

        setLoading,

      }}

    >

      {children}

    </BookingContext.Provider>

  );

}





export function useBookingContext(){

  return useContext(
    BookingContext
  );

}
