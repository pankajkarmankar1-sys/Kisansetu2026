// services/driverService.js

import { supabase } from "../lib/supabase";


// Save Driver
export async function saveDriver(data) {

  const driver = {

    phone:
      data.phone || null,

    name:
      data.name || null,

    village:
      data.village || null,

    tractor_num:
      data.tractorNum || null,

    tractor_det:
      data.tractorDet || null,

    aadhaar_done:
      !!data.aadDone,

    lic_done:
      !!data.licDone,

    approved:
      false,

    updated_at:
      new Date().toISOString(),

  };


  const {
    error
  } = await supabase
    .from("drivers")
    .upsert(
      driver,
      {
        onConflict:"phone",
      }
    );


  if(error) {
    throw error;
  }


  return {
    success:true,
  };

}



// Get Driver
export async function getDriver(
  phone
) {

  const {
    data,
    error
  } = await supabase
    .from("drivers")
    .select("*")
    .eq(
      "phone",
      phone
    )
    .maybeSingle();


  if(error) {
    throw error;
  }


  return data;

}



// Update Driver
export async function updateDriver(
  data
) {

  const {
    error
  } = await supabase
    .from("drivers")
    .update(
      {
        ...data,
        updated_at:
          new Date().toISOString(),
      }
    )
    .eq(
      "phone",
      data.phone
    );


  if(error) {
    throw error;
  }


  return {
    success:true,
  };

}
