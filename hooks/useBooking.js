// hooks/useBooking.js

import { useState } from "react";
import {
  createBooking,
  getBookings,
  cancelBooking,
} from "../services/bookingService";


export default function useBooking() {

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);



  async function addBooking(data) {

    try {

      setLoading(true);
      setError(null);


      const booking =
        await createBooking(data);


      setBookings((prev) => [
        ...prev,
        booking
      ]);


      return booking;


    } catch (err) {

      setError(err.message);

      throw err;


    } finally {

      setLoading(false);

    }

  }





  async function loadBookings() {

    try {

      setLoading(true);


      const data =
        await getBookings();


      setBookings(data || []);


    } catch (err) {

      setError(err.message);


    } finally {

      setLoading(false);

    }

  }





  async function removeBooking(id) {

    try {

      await cancelBooking(id);


      setBookings((prev) =>
        prev.filter(
          (b) => b.id !== id
        )
      );


    } catch (err) {

      setError(err.message);

      throw err;

    }

  }





  return {

    bookings,

    loading,

    error,

    addBooking,

    loadBookings,

    removeBooking,

  };

}
