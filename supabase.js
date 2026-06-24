import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
export async function sbSaveUser(u){
  const{error}=await supabase.from("users").upsert({phone:u.phone,name:u.name||null,village:u.village||null,farm_address:u.farmAddress||null,acres:parseFloat(u.acres||0),aadhaar_done:!!u.aadDone,sat_done:!!u.satDone,role:"customer",updated_at:new Date().toISOString()},{onConflict:"phone"});
  if(error)console.error("sbSaveUser:",error.message);
}
export async function sbGetUser(phone){const{data}=await supabase.from("users").select("*").eq("phone",phone).maybeSingle();return data;}
export async function sbSaveDriver(d){
  const{error}=await supabase.from("drivers").upsert({phone:d.phone,name:d.name||null,village:d.village||null,tractor_num:d.tractorNum||null,tractor_det:d.tractorDet||null,aadhaar_done:!!d.aadDone,lic_done:!!d.licDone,approved:false,updated_at:new Date().toISOString()},{onConflict:"phone"});
  if(error)console.error("sbSaveDriver:",error.message);
}
export async function sbGetDriver(phone){const{data}=await supabase.from("drivers").select("*").eq("phone",phone).maybeSingle();return data;}
export async function sbSaveBooking(b){
  const{error}=await supabase.from("bookings").upsert({id:b.id,customer_phone:b.ph,customer_name:b.name||null,village:b.village||null,service_id:b.serviceId||null,service_name_hi:b.serviceNameHi||null,icon:b.icon||null,acres:parseFloat(b.acres||0),amount:b.amount||0,date:b.date||null,note:b.note||null,khet_name:b.khetName||null,khet_village:b.khetVillage||null,khet_acres:parseFloat(b.khetAcres||0)||null,sat712_label:b.sat712Label||null,status:b.status||"Pending",booking_status:b.booking_status||"confirmed",payment_status:b.payment_status||"paid",driver_id:b.driverId||null,pay_method:b.payMethod||null,pay_ref:b.payRef||null,completion_otp:b.completionOtp||"1234",paid_at:b.paidAt||null,created_at:b.at||new Date().toISOString()},{onConflict:"id"});
  if(error)console.error("sbSaveBooking:",error.message);
}
export async function sbSaveSubscription(phone,acres,amt){
  const{error}=await supabase.from("subscriptions").insert({user_phone:phone,acres:parseFloat(acres),amount:amt,rate_per_acre:550,status:"active",expiry_date:new Date(Date.now()+365*24*60*60*1000).toISOString()});
  if(error)console.error("sbSaveSub:",error.message);
}
export async function sbGetAllUsers(){const{data}=await supabase.from("users").select("*").order("created_at",{ascending:false});return data||[];}
export async function sbGetAllBookings(){const{data}=await supabase.from("bookings").select("*").order("created_at",{ascending:false});return data||[];}
export async function sbGetAllDrivers(){const{data}=await supabase.from("drivers").select("*").order("created_at",{ascending:false});return data||[];}
export async function sbSendNotification(message,send_to="all",title=""){const{error}=await supabase.from("notifications").insert({message,send_to,title});if(error)console.error(error.message);}
export async function sbGetNotifications(){const{data}=await supabase.from("notifications").select("*").order("sent_at",{ascending:false}).limit(30);return data||[];}
