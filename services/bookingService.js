// services/bookingService.js

import { supabase } from "../lib/supabase";
import {
  calculateAmount
} from "../utils/supabaseHelpers";


// Create Booking
export async function createBooking(data) {

  const booking = {

    customer_id:
      data.customer_id,

    service_name:
      data.service,

    acres:
      Number(data.acres || 0),

    rate:
      Number(data.rate || 0),

    amount:
      calculateAmount(
        data.acres,
        data.rate
      ),

    status:
      "Pending",

    note:
      data.note || "",

    created_at:
      new Date().toISOString(),

  };


  const {
    data:result,
    error
  } = await supabase
    .from("bookings")
    .insert([booking])
    .select()
    .single();


  if(error) {
    throw error;
  }


  return result;

}



// Get All Bookings
export async function getBookings() {

  const {
    data,
    error
  } = await supabase
    .from("bookings")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false,
      }
    );


  if(error) {
    throw error;
  }


  return data || [];

}



// Update Booking
export async function updateBooking(
  id,
  data
) {


  const {
    error
  } = await supabase
    .from("bookings")
    .update(data)
    .eq(
      "id",
      id
    );


  if(error) {
    throw error;
  }


  return {
    success:true,
  };

}



// Cancel Booking
export async function cancelBooking(id) {

  return updateBooking(
    id,
    {
      status:"Cancelled",
    }
  );

}
