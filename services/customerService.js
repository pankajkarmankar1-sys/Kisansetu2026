// services/customerService.js

import { supabase } from "../lib/supabase";


// Save Customer
export async function saveCustomer(data) {

  const customer = {

    id:
      data.id,

    name:
      data.name || null,

    phone:
      data.phone || null,

    village:
      data.village || null,

    farm_address:
      data.farmAddress || null,

    acres:
      Number(data.acres || 0),

    role:
      "customer",

    updated_at:
      new Date().toISOString(),

  };


  const {
    error
  } = await supabase
    .from("profiles")
    .upsert(
      customer,
      {
        onConflict:"id",
      }
    );


  if(error) {
    throw error;
  }


  return {
    success:true,
  };

}



// Get Customer
export async function getCustomer(
  id
) {

  const {
    data,
    error
  } = await supabase
    .from("profiles")
    .select("*")
    .eq(
      "id",
      id
    )
    .maybeSingle();


  if(error) {
    throw error;
  }


  return data;

}



// Update Customer
export async function updateCustomer(
  data
) {

  const {
    error
  } = await supabase
    .from("profiles")
    .update(
      {
        ...data,
        updated_at:
          new Date().toISOString(),
      }
    )
    .eq(
      "id",
      data.id
    );


  if(error) {
    throw error;
  }


  return {
    success:true,
  };

}
