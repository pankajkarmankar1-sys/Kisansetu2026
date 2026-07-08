// engines/bookingEngine.js

import defaultDB from "../data/defaultDB";


export function createBooking(data) {

  if (!data) {
    return null;
  }


  const booking = {

    id:
      data.id ||
      "BOOK_" +
      Date.now(),


    ...data,


    status:
      data.status ||
      "Pending",


    createdAt:
      new Date().toISOString(),

  };


  defaultDB.bookings.push(
    booking
  );


  return booking;

}





export function getBookings() {

  return [
    ...defaultDB.bookings
  ];

}





export function updateBooking(
  id,
  values
) {

  const booking =
    defaultDB.bookings.find(
      (b) => b.id === id
    );


  if (!booking) {
    return null;
  }


  Object.assign(
    booking,
    values,
    {
      updatedAt:
        new Date().toISOString(),
    }
  );


  return booking;

}





export function deleteBooking(id) {

  const oldLength =
    defaultDB.bookings.length;


  defaultDB.bookings =
    defaultDB.bookings.filter(
      (b) => b.id !== id
    );


  return (
    oldLength !==
    defaultDB.bookings.length
  );

}
