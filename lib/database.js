import { supabase } from "./supabase";

// ==========================
// USERS
// ==========================

export async function sbSaveUser(user) {
  const { error } = await supabase.from("users").upsert(
    {
      phone: user.phone,
      name: user.name || null,
      village: user.village || null,
      farm_address: user.farmAddress || null,
      acres: parseFloat(user.acres || 0),
      aadhaar_done: !!user.aadDone,
      sat_done: !!user.satDone,
      role: "customer",
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "phone",
    }
  );

  if (error) throw error;
}

export async function sbGetUser(phone) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// ==========================
// DRIVERS
// ==========================

export async function sbSaveDriver(driver) {
  const { error } = await supabase.from("drivers").upsert(
    {
      phone: driver.phone,
      name: driver.name || null,
      village: driver.village || null,
      tractor_num: driver.tractorNum || null,
      tractor_det: driver.tractorDet || null,
      aadhaar_done: !!driver.aadDone,
      lic_done: !!driver.licDone,
      approved: false,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "phone",
    }
  );

  if (error) throw error;
}

export async function sbGetDriver(phone) {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function sbGetAllUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function sbGetAllDrivers() {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}
booking.id
