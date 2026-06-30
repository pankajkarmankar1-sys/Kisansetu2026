"use client";
import OTPLogin from "./OTPLogin";
import CustomerRegistration from "./CustomerRegistration";
import DriverRegistration from "./DriverRegistration";
import { useState, useRef, useEffect } from "react";

// ─── Supabase Client ──────────────────────────────────────────────────────




// ─── Supabase Auth Helpers ────────────────────────────────────────────────
async function sbSendOTP(phone){
  const {error}=await supa.auth.signInWithOtp({phone:"+91"+phone});
  if(error) throw error;
}
async function sbVerifyOTP(phone,otp){
  const {data,error}=await supa.auth.verifyOtp({phone:"+91"+phone,token:otp,type:"sms"});
  if(error) throw error;
  return data;
}

// ─── DB Helpers ───────────────────────────────────────────────────────────
async function sbSaveUser(u){
  const {error}=await supa.from("users").upsert({
    phone:u.phone, name:u.name, village:u.village||null,
    farm_address:u.farmAddress||null, acres:parseFloat(u.acres||0),
    aadhaar_done:!!u.aadDone, sat_done:!!u.satDone,
    role:"customer", updated_at:new Date().toISOString()
  },{onConflict:"phone"});
  if(error) console.error("sbSaveUser:",error.message);
}
async function sbGetUser(phone){
  const {data}=await supa.from("users").select("*").eq("phone",phone).maybeSingle();
  return data;
}
async function sbSaveDriver(d){
  const {error}=await supa.from("drivers").upsert({
    phone:d.phone, name:d.name, village:d.village||null,
    tractor_num:d.tractorNum||null, tractor_det:d.tractorDet||null,
    aadhaar_done:!!d.aadDone, lic_done:!!d.licDone,
    approved:false, updated_at:new Date().toISOString()
  },{onConflict:"phone"});
  if(error) console.error("sbSaveDriver:",error.message);
}
async function sbGetDriver(phone){
  const {data}=await supa.from("drivers").select("*").eq("phone",phone).maybeSingle();
  return data;
}
async function sbSaveBooking(b){
  const {error}=await supa.from("bookings").upsert({
    id:b.id, customer_phone:b.ph, customer_name:b.name,
    village:b.village||null, service_id:b.serviceId||null,
    service_name:b.serviceNameHi||null, icon:b.icon||null,
    acres:parseFloat(b.acres||0), amount:b.amount||0,
    date:b.date||null, note:b.note||null,
    khet_name:b.khetName||null, khet_village:b.khetVillage||null,
    khet_acres:parseFloat(b.khetAcres||0)||null,
    sat712_label:b.sat712Label||null,
    booking_status:b.booking_status||"confirmed",
    payment_status:b.payment_status||"paid",
    pay_method:b.payMethod||null, pay_ref:b.payRef||null,
    completion_otp:b.completionOtp||"1234",
    status:b.status||"Pending",
    paid_at:b.paidAt||null, created_at:b.at||new Date().toISOString()
  },{onConflict:"id"});
  if(error) console.error("sbSaveBooking:",error.message);
}
async function sbSaveSubscription(phone,acres,amt){
  const {error}=await supa.from("subscriptions").insert({
    user_phone:phone, acres:parseFloat(acres||0), amount:amt||0,
    rate_per_acre:550, status:"active",
    expiry_date: new Date(Date.now()+365*24*60*60*1000).toISOString()
  });
  if(error) console.error("sbSaveSub:",error.message);
}
async function sbUploadFile(dataUrl, bucket, path){
  // Convert base64 dataUrl to blob
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const {data,error} = await supa.storage.from(bucket).upload(path, blob, {upsert:true});
    if(error) throw error;
    const {data:url} = supa.storage.from(bucket).getPublicUrl(path);
    return url.publicUrl;
  } catch(e){
    console.error("upload error:",e);
    return null;
  }
}
async function sbGetAllUsers(){
  const {data}=await supa.from("users").select("*").order("created_at",{ascending:false});
  return data||[];
}
async function sbGetAllBookings(){
  const {data}=await supa.from("bookings").select("*").order("created_at",{ascending:false});
  return data||[];
}
async function sbGetAllDrivers(){
  const {data}=await supa.from("drivers").select("*").order("phone");
  return data||[];
}
async function sbSendNotification(msg,to="all"){
  const {error}=await supa.from("notifications").insert({message:msg,send_to:to});
  if(error) console.error("sbNotif:",error.message);
}
async function sbGetNotifications(){
  const {data}=await supa.from("notifications").select("*").order("sent_at",{ascending:false}).limit(30);
  return data||[];
}
// ─── End Supabase ─────────────────────────────────────────────────────────


// ─── Data ─────────────────────────────────────────────────────────────────
const SVC=[
  {id:"k", n:"कश्या निकालना & जमा करना", sub:410, norm:820,  ico:"🌾"},
  {id:"pj",n:"पंजी मारना",                sub:410, norm:820,  ico:"🔨"},
  {id:"ph",n:"फास मारना",                 sub:410, norm:820,  ico:"⚙️"},
  {id:"na",n:"नागर्णी",                   sub:810, norm:1620, ico:"🚜"},
  {id:"cu",n:"कल्टीवेटर",                 sub:410, norm:820,  ico:"🌱"},
  {id:"bd",n:"बेड मेकर",                  sub:610, norm:1220, ico:"🏗️"},
  {id:"ro",n:"रोटावेटर",                  sub:710, norm:1420, ico:"🔁"},
];
const S_TOT=SVC.reduce((a,x)=>a+x.sub,0);
const N_TOT=SVC.reduce((a,x)=>a+x.norm,0);
const SAVE=N_TOT-S_TOT;

const DB={users:{},bookings:[],drivers:{},chats:{},khets:{},reviews:{},
  fleet:{},          // tractorId → TractorProfile
  waitList:[],       // bookings waiting for capacity
  transfers:[],      // breakdown transfer history
  schedules:{},      // tractorId → {date: [bookingIds]}
};
const fd=d=>d?new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"";
const ft=d=>d?new Date(d).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}):"";
const inr=n=>"₹"+(Math.round(n)||0).toLocaleString("en-IN");
const gid=()=>Math.random().toString(36).slice(2,8).toUpperCase();
const ADMIN_PWD="kisan2025";

// ═══════════════════════════════════════════════════════════════════════════
// FLEET DISPATCH & SCHEDULING ENGINE
// ═══════════════════════════════════════════════════════════════════════════

// ── Tractor statuses ───────────────────────────────────────────────────────
const TRACTOR_STATUS = {
  AVAILABLE:   "Available",
  BUSY:        "Busy",
  MAINTENANCE: "Maintenance",
  BREAKDOWN:   "Breakdown",
};

// ── Register a tractor from driver registration ───────────────────────────
function registerTractor(driver) {
  const id = driver.phone;
  if (DB.fleet[id]) return; // already registered
  DB.fleet[id] = {
    id,
    name:          driver.tractorDet || driver.tractorNum || "Tractor",
    tractorNum:    driver.tractorNum || "—",
    village:       driver.village    || "—",
    driverPhone:   driver.phone,
    driverName:    driver.name,
    status:        TRACTOR_STATUS.AVAILABLE,
    dailyCapacity: 20,   // default 20 acres/day
    pendingAcres:  0,
    activeAcres:   0,
    completedAcres:driver.acresCompleted || 0,
    assignedJobs:  [],
    completedJobs: 0,
    joinedAt:      driver.joinedAt || new Date().toISOString(),
  };
  if (!DB.schedules[id]) DB.schedules[id] = {};
}

// ── Sync all registered drivers into fleet ───────────────────────────────
function syncFleet() {
  Object.entries(DB.drivers || {}).forEach(([ph, d]) => {
    if (d.approved && !d.blocked) registerTractor({...d, phone: ph});
  });
}

// ── Get available tractors sorted by priority ─────────────────────────────
// Priority: same village → nearest (by name similarity) → any available
function getAvailableTractors(customerVillage) {
  syncFleet();
  const all = Object.values(DB.fleet).filter(t =>
    t.status === TRACTOR_STATUS.AVAILABLE &&
    DB.drivers[t.driverPhone]?.approved &&
    !DB.drivers[t.driverPhone]?.blocked
  );
  // Sort: same village first, then alphabetically close, then rest
  return all.sort((a, b) => {
    const aMatch = a.village === customerVillage ? 0 : 1;
    const bMatch = b.village === customerVillage ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    // Secondary: fewest pending acres (load balancing)
    return a.pendingAcres - b.pendingAcres;
  });
}

// ── Reserve dates in tractor schedule ────────────────────────────────────
function reserveSchedule(tractorId, startDate, acres) {
  const t = DB.fleet[tractorId];
  if (!t) return [];
  const cap = t.dailyCapacity || 20;
  const daysNeeded = Math.ceil(acres / cap);
  const reserved = [];
  let d = startDate ? new Date(startDate) : new Date();
  let remaining = daysNeeded;
  while (remaining > 0) {
    const key = d.toISOString().split("T")[0];
    if (!DB.schedules[tractorId]) DB.schedules[tractorId] = {};
    if (!DB.schedules[tractorId][key]) DB.schedules[tractorId][key] = [];
    reserved.push(key);
    remaining--;
    d.setDate(d.getDate() + 1);
  }
  return reserved;
}

// ── AUTO ASSIGN: core dispatch function ──────────────────────────────────
function autoAssign(booking) {
  const tractors = getAvailableTractors(booking.village || "");
  if (tractors.length === 0) {
    // No tractor available → add to waiting list
    DB.waitList.push({ bookingId: booking.id, addedAt: new Date().toISOString() });
    const idx = DB.bookings.findIndex(b => b.id === booking.id);
    if (idx >= 0) DB.bookings[idx].assignmentStatus = "waiting";
    return null;
  }
  const tractor = tractors[0];
  const acres = parseFloat(booking.acres) || 1;
  const reserved = reserveSchedule(tractor.id, booking.date, acres);

  // Update booking
  const idx = DB.bookings.findIndex(b => b.id === booking.id);
  if (idx >= 0) {
    DB.bookings[idx].driverId        = tractor.driverPhone;
    DB.bookings[idx].tractorId       = tractor.id;
    DB.bookings[idx].tractorNum      = tractor.tractorNum;
    DB.bookings[idx].driverName      = tractor.driverName;
    DB.bookings[idx].status          = "Accepted";
    DB.bookings[idx].drvWorkflow     = "accepted";
    DB.bookings[idx].assignmentStatus= "assigned";
    DB.bookings[idx].scheduledDates  = reserved;
    DB.bookings[idx].assignedAt      = new Date().toISOString();
  }
  // Update tractor
  tractor.pendingAcres += acres;
  tractor.assignedJobs.push(booking.id);
  if (reserved.length > 0) {
    reserved.forEach(dt => {
      if (!DB.schedules[tractor.id]) DB.schedules[tractor.id] = {};
      if (!DB.schedules[tractor.id][dt]) DB.schedules[tractor.id][dt] = [];
      DB.schedules[tractor.id][dt].push(booking.id);
    });
  }
  // Mark busy if fully loaded
  const dayLoad = Object.values(DB.schedules[tractor.id] || {})
    .reduce((s, arr) => s + arr.length, 0);
  if (tractor.pendingAcres >= tractor.dailyCapacity * 5) {
    tractor.status = TRACTOR_STATUS.BUSY;
  }
  return tractor;
}

// ── BREAKDOWN HANDLER ────────────────────────────────────────────────────
function handleBreakdown(tractorId, reason = "Breakdown") {
  const t = DB.fleet[tractorId];
  if (!t) return;
  t.status = TRACTOR_STATUS.BREAKDOWN;

  // Find all pending jobs for this tractor
  const pendingJobs = DB.bookings.filter(b =>
    b.tractorId === tractorId &&
    !["Completed", "Cancelled"].includes(b.status)
  );
  if (pendingJobs.length === 0) return;

  // Find next available tractor (different from broken one)
  const alts = getAvailableTractors(t.village).filter(x => x.id !== tractorId);
  const newTractor = alts[0] || null;

  pendingJobs.forEach(job => {
    const transfer = {
      id:            "TR" + Math.random().toString(36).slice(2,7).toUpperCase(),
      bookingId:     job.id,
      fromTractorId: tractorId,
      fromTractor:   t.tractorNum,
      fromDriver:    t.driverName,
      toTractorId:   newTractor?.id   || null,
      toTractor:     newTractor?.tractorNum || "Unassigned",
      toDriver:      newTractor?.driverName || "Unassigned",
      reason,
      transferredAt: new Date().toISOString(),
    };
    DB.transfers.push(transfer);

    const idx = DB.bookings.findIndex(b => b.id === job.id);
    if (newTractor && idx >= 0) {
      DB.bookings[idx].driverId        = newTractor.driverPhone;
      DB.bookings[idx].tractorId       = newTractor.id;
      DB.bookings[idx].tractorNum      = newTractor.tractorNum;
      DB.bookings[idx].driverName      = newTractor.driverName;
      DB.bookings[idx].assignmentStatus = "transferred";
      DB.bookings[idx].transferHistory  = [...(DB.bookings[idx].transferHistory||[]), transfer];
      newTractor.pendingAcres += parseFloat(job.acres) || 0;
      newTractor.assignedJobs.push(job.id);
    } else if (idx >= 0) {
      DB.bookings[idx].assignmentStatus = "waiting";
      DB.waitList.push({ bookingId: job.id, addedAt: new Date().toISOString() });
    }
    // Free from broken tractor
    t.pendingAcres = Math.max(0, t.pendingAcres - (parseFloat(job.acres) || 0));
    t.assignedJobs = t.assignedJobs.filter(id => id !== job.id);
  });
}

// ── MANUAL REASSIGN ──────────────────────────────────────────────────────
function manualReassign(bookingId, newTractorId) {
  const booking = DB.bookings.find(b => b.id === bookingId);
  const newT    = DB.fleet[newTractorId];
  if (!booking || !newT) return false;

  // Free old tractor
  if (booking.tractorId && DB.fleet[booking.tractorId]) {
    const old = DB.fleet[booking.tractorId];
    old.pendingAcres = Math.max(0, old.pendingAcres - (parseFloat(booking.acres) || 0));
    old.assignedJobs = old.assignedJobs.filter(id => id !== bookingId);
  }
  // Assign new
  const idx = DB.bookings.findIndex(b => b.id === bookingId);
  if (idx >= 0) {
    DB.bookings[idx].driverId         = newT.driverPhone;
    DB.bookings[idx].tractorId        = newT.id;
    DB.bookings[idx].tractorNum       = newT.tractorNum;
    DB.bookings[idx].driverName       = newT.driverName;
    DB.bookings[idx].status           = "Accepted";
    DB.bookings[idx].drvWorkflow      = "accepted";
    DB.bookings[idx].assignmentStatus = "reassigned";
    DB.bookings[idx].assignedAt       = new Date().toISOString();
  }
  newT.pendingAcres += parseFloat(booking.acres) || 0;
  newT.assignedJobs.push(bookingId);
  return true;
}

// ── Process waiting list when capacity frees up ───────────────────────────
function processWaitList() {
  if (!DB.waitList.length) return;
  const remaining = [];
  DB.waitList.forEach(w => {
    const bk = DB.bookings.find(b => b.id === w.bookingId);
    if (!bk || bk.status === "Cancelled") return;
    const result = autoAssign(bk);
    if (!result) remaining.push(w); // still waiting
  });
  DB.waitList.length = 0;
  DB.waitList.push(...remaining);
}

// ── Fleet capacity summary ────────────────────────────────────────────────
function fleetSummary() {
  syncFleet();
  const all = Object.values(DB.fleet);
  const totalCap    = all.reduce((s, t) => s + (t.dailyCapacity || 20), 0);
  const usedCap     = all.reduce((s, t) => s + t.pendingAcres, 0);
  const completedAc = all.reduce((s, t) => s + t.completedAcres, 0);
  return {
    total:       all.length,
    available:   all.filter(t => t.status === TRACTOR_STATUS.AVAILABLE).length,
    busy:        all.filter(t => t.status === TRACTOR_STATUS.BUSY).length,
    maintenance: all.filter(t => t.status === TRACTOR_STATUS.MAINTENANCE).length,
    breakdown:   all.filter(t => t.status === TRACTOR_STATUS.BREAKDOWN).length,
    totalCap,
    usedCap: Math.round(usedCap),
    freeCap:     Math.max(0, Math.round(totalCap - usedCap)),
    utilPct:     totalCap > 0 ? Math.round((usedCap / totalCap) * 100) : 0,
    completedAc: Math.round(completedAc),
    waiting:     DB.waitList.length,
  };
}

// ── Village workload map ──────────────────────────────────────────────────
function villageWorkload() {
  const map = {};
  Object.values(DB.fleet).forEach(t => {
    if (!map[t.village]) map[t.village] = { tractors: 0, pendingAc: 0, completedAc: 0 };
    map[t.village].tractors++;
    map[t.village].pendingAc   += t.pendingAcres;
    map[t.village].completedAc += t.completedAcres;
  });
  return map;
}
// ── End Fleet Engine ──────────────────────────────────────────────────────

// ─── INCENTIVE SYSTEM ─────────────────────────────────────────────────────
// Total Budget: ₹2.25 Crore — NEVER EXCEED
const TOTAL_BUDGET     = 22500000;   // ₹2.25 Crore hard cap
const POOL_MILESTONE   = 11250000;   // ₹1.125 Crore
const POOL_PERFORMANCE = 7500000;    // ₹75 Lakh
const POOL_LEADERBOARD = 3750000;    // ₹37.5 Lakh
const TOTAL_DRIVERS    = 100;
// NOTE: No fixed acre target — total acres are dynamic (could be 2.5L, 3L, 4L+)

// Milestone tiers — based on individual driver's own completed acres
// Bonus amounts auto-scale to POOL_MILESTONE across all 100 drivers
const MILESTONE_TIERS = [
  {acres:25,   pct:0.5,  label:"25 Acres"},
  {acres:50,   pct:1.0,  label:"50 Acres"},
  {acres:100,  pct:2.0,  label:"100 Acres"},
  {acres:200,  pct:3.5,  label:"200 Acres"},
  {acres:500,  pct:6.0,  label:"500 Acres"},
  {acres:1000, pct:10.0, label:"1000 Acres"},
  {acres:2000, pct:15.0, label:"2000 Acres"},
  {acres:5000, pct:20.0, label:"5000 Acres"},
];
// Compute actual bonus from pct of POOL_MILESTONE (total pool / 100 drivers)
const driverMilestonePool = POOL_MILESTONE / TOTAL_DRIVERS;
const MILESTONES = MILESTONE_TIERS.map(t=>({...t, bonus: Math.round((t.pct/100)*POOL_MILESTONE)}));

// Demo leaderboard data (100 drivers, variable acres)
const DEMO_DRIVERS = [
  {name:"Ramesh Kumar",   ph:"d01",village:"Durgapur",   ac:5200,rating:4.8,jobs:62,cr:97},
  {name:"Suresh Patil",   ph:"d02",village:"Nagpur",     ac:4900,rating:4.7,jobs:58,cr:95},
  {name:"Anil Shinde",    ph:"d03",village:"Wardha",     ac:4700,rating:4.9,jobs:55,cr:98},
  {name:"Vijay Deshmukh", ph:"d04",village:"Yavatmal",   ac:4200,rating:4.6,jobs:50,cr:93},
  {name:"Manoj Yadav",    ph:"d05",village:"Chandrapur", ac:3900,rating:4.5,jobs:46,cr:91},
  {name:"Rajesh More",    ph:"d06",village:"Amravati",   ac:3600,rating:4.8,jobs:43,cr:96},
  {name:"Ganesh Pawar",   ph:"d07",village:"Akola",      ac:3400,rating:4.7,jobs:40,cr:94},
  {name:"Dinesh Thakur",  ph:"d08",village:"Bhandara",   ac:3100,rating:4.6,jobs:37,cr:92},
  {name:"Santosh Kale",   ph:"d09",village:"Gondia",     ac:2900,rating:4.9,jobs:34,cr:98},
  {name:"Pravin Munde",   ph:"d10",village:"Washim",     ac:2700,rating:4.5,jobs:32,cr:90},
  {name:"Kiran Bhosale",  ph:"d11",village:"Buldhana",   ac:2500,rating:4.7,jobs:30,cr:93},
  {name:"Sanjay Gaikwad", ph:"d12",village:"Hingoli",    ac:2200,rating:4.8,jobs:26,cr:95},
];
for(let i=13;i<=100;i++) DEMO_DRIVERS.push({
  name:`Driver ${i}`,ph:`d${i}`,village:"Various",
  ac:Math.max(20,2000-i*18),
  rating:parseFloat((4.0+Math.random()*0.9).toFixed(1)),
  jobs:Math.max(3,25-Math.floor(i*0.22)),
  cr:Math.round(80+Math.random()*18),
});

// ─── DYNAMIC Incentive Calculation ─────────────────────────────────────────
// No hardcoded targets. Uses actual acres from all drivers.
function calcIncentives(driver){
  const ac     = driver?.acresCompleted||0;
  const cr     = driver?.completionRate||100;   // 0-100
  const rating = driver?.rating||5;

  // ── Real registered drivers from DB
  const dbDrivers = Object.values(DB?.drivers||{})
    .filter(d=>d.acresCompleted>0)
    .map(d=>({ac:d.acresCompleted||0,cr:d.completionRate||100,rating:d.rating||5}));

  // ── Combine DB drivers + demo drivers for pool calculations
  const allDrivers = [
    ...DEMO_DRIVERS.map(d=>({ac:d.ac,cr:d.cr,rating:d.rating})),
    ...dbDrivers,
  ];
  const totalCompanyAc = allDrivers.reduce((s,d)=>s+d.ac,0)+ac||1;

  // ── 1. MILESTONE POOL ──────────────────────────────────────────────────
  // Dynamic: milestones are % of pool; each tier is earned when driver hits that acre mark
  // Total milestone budget = POOL_MILESTONE / TOTAL_DRIVERS per driver
  const reachedTiers = MILESTONES.filter(m=>ac>=m.acres);
  const maxMilestone = driverMilestonePool; // per-driver cap
  const milestoneRaw = reachedTiers.reduce((s,m)=>s+(m.pct/100)*POOL_MILESTONE, 0);
  const milestoneEarned = Math.min(milestoneRaw, maxMilestone);

  // ── 2. PERFORMANCE POOL ────────────────────────────────────────────────
  // Score = Acres × (CR/100) × (Rating/5)
  // Driver share = (myScore / totalScore) × POOL_PERFORMANCE
  const myPerfScore   = ac * (cr/100) * (rating/5);
  const totalPerfScore = allDrivers.reduce((s,d)=>s+d.ac*(d.cr/100)*(d.rating/5),0)+myPerfScore||1;
  const perfShare      = myPerfScore / totalPerfScore;
  const perfCap        = POOL_PERFORMANCE / TOTAL_DRIVERS * 4; // no single driver gets >4x fair share
  const perfEarned     = Math.min(perfShare * POOL_PERFORMANCE, perfCap);

  // ── 3. LEADERBOARD POOL ─────────────────────────────────────────────────
  // Top 20 drivers by acres. Share percentages sum to 100%.
  const lbShares = [12,10,8,7,6,5.5,5,4.5,4,3.5,3,2.5,2,1.8,1.6,1.4,1.2,1,0.8,0.7];
  const rank = allDrivers.filter(d=>d.ac>ac).length + 1; // live rank
  const lbEarned = rank<=20 ? (lbShares[rank-1]/100)*POOL_LEADERBOARD : 0;

  // ── HARD BUDGET CAP ────────────────────────────────────────────────────
  const totalRaw = milestoneEarned + perfEarned + lbEarned;
  const globalCap = TOTAL_BUDGET / TOTAL_DRIVERS * 3; // no single driver > 3x fair share
  const scale = totalRaw > globalCap ? globalCap / totalRaw : 1;

  return {
    milestone:    Math.round(milestoneEarned  * scale),
    performance:  Math.round(perfEarned       * scale),
    leaderboard:  Math.round(lbEarned         * scale),
    total:        Math.round(totalRaw         * scale),
    rank,
    perfScore:    Math.round(myPerfScore * 10) / 10,
    totalCompanyAc,
    nextMilestone: MILESTONES.find(m=>ac<m.acres)||null,
    paidOut:       Math.round(allDrivers.reduce((s,d)=>{
      const m=MILESTONES.filter(x=>d.ac>=x.acres).reduce((t,x)=>t+(x.pct/100)*POOL_MILESTONE,0);
      const p=(d.ac*(d.cr/100)*(d.rating/5)/totalPerfScore||1)*POOL_PERFORMANCE;
      return s+Math.min(m,maxMilestone)+Math.min(p,perfCap);
    },0)),
  };
}


// ─── Incentive calculation (capped at TOTAL_BUDGET) ───────────────────────


// ─── Styles ───────────────────────────────────────────────────────────────
const S={
  // Layout
  page:{fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",background:"#F8FAFC",minHeight:"100vh",maxWidth:480,margin:"0 auto"},
  // Cards
  card:{background:"#FFFFFF",borderRadius:20,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,.04),0 4px 24px rgba(0,0,0,.06)",marginBottom:14,border:"1px solid rgba(0,0,0,.04)"},
  cardBlue:{background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",borderRadius:20,padding:20,marginBottom:14,border:"1px solid #BFDBFE"},
  cardGreen:{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",borderRadius:20,padding:20,marginBottom:14,border:"1px solid #BBF7D0"},
  cardGold:{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",borderRadius:20,padding:20,marginBottom:14,border:"1px solid #FDE68A"},
  cardDark:{background:"linear-gradient(135deg,#0F172A,#1E293B)",borderRadius:20,padding:20,marginBottom:14},
  // Typography
  h1:{fontSize:26,fontWeight:900,color:"#0F172A",margin:"0 0 4px",letterSpacing:"-.5px"},
  h2:{fontSize:20,fontWeight:800,color:"#0F172A",margin:"0 0 4px"},
  h3:{fontSize:16,fontWeight:700,color:"#0F172A",margin:"0 0 12px"},
  body:{fontSize:14,color:"#334155",lineHeight:1.5},
  caption:{fontSize:12,color:"#64748B",fontWeight:500},
  label:{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:7,display:"block",textTransform:"uppercase",letterSpacing:".8px"},
  // Form
  inp:{width:"100%",padding:"15px 16px",border:"1.5px solid #E2E8F0",borderRadius:14,fontSize:15,outline:"none",background:"#FAFFFE",color:"#0F172A",fontFamily:"inherit",display:"block",transition:"border .2s,box-shadow .2s"},
  lbl:{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:7,display:"block",textTransform:"uppercase",letterSpacing:".8px"},
  // Buttons
  btnG:{background:"linear-gradient(135deg,#16A34A,#15803D)",color:"#fff",border:"none",borderRadius:16,padding:17,fontSize:15,fontWeight:800,cursor:"pointer",width:"100%",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(22,163,74,.3)",letterSpacing:".1px",transition:"transform .15s,box-shadow .15s"},
  btnW:{background:"#fff",color:"#16A34A",border:"2px solid #16A34A",borderRadius:16,padding:15,fontSize:15,fontWeight:800,cursor:"pointer",width:"100%",fontFamily:"inherit",marginTop:10,transition:"all .15s"},
  btnB:{background:"linear-gradient(135deg,#2563EB,#1D4ED8)",color:"#fff",border:"none",borderRadius:16,padding:17,fontSize:15,fontWeight:800,cursor:"pointer",width:"100%",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(37,99,235,.3)",transition:"transform .15s"},
  btnO:{background:"linear-gradient(135deg,#EA580C,#C2410C)",color:"#fff",border:"none",borderRadius:16,padding:17,fontSize:15,fontWeight:800,cursor:"pointer",width:"100%",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(234,88,12,.28)"},
  btnD:{background:"linear-gradient(135deg,#374151,#111827)",color:"#fff",border:"none",borderRadius:16,padding:17,fontSize:15,fontWeight:800,cursor:"pointer",width:"100%",fontFamily:"inherit"},
  btnRed:{background:"linear-gradient(135deg,#DC2626,#B91C1C)",color:"#fff",border:"none",borderRadius:16,padding:17,fontSize:15,fontWeight:800,cursor:"pointer",width:"100%",fontFamily:"inherit"},
  btnGhost:{background:"transparent",color:"#16A34A",border:"1.5px solid #16A34A",borderRadius:14,padding:13,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"},
  // Header
  hdr:{padding:"52px 20px 24px",color:"#fff",background:"linear-gradient(150deg,#14532D 0%,#16A34A 60%,#22C55E 100%)",position:"relative",overflow:"hidden"},
  hdrBlue:{padding:"52px 20px 24px",color:"#fff",background:"linear-gradient(150deg,#1E3A8A 0%,#2563EB 60%,#3B82F6 100%)",position:"relative",overflow:"hidden"},
  hdrDark:{padding:"52px 20px 24px",color:"#fff",background:"linear-gradient(150deg,#0F172A 0%,#1E293B 60%,#334155 100%)",position:"relative",overflow:"hidden"},
  bkb:{background:"rgba(255,255,255,.15)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.22)",color:"#fff",fontSize:13,fontWeight:600,padding:"8px 15px",borderRadius:12,cursor:"pointer",marginBottom:12,display:"inline-flex",alignItems:"center",gap:5,fontFamily:"inherit"},
  // Badges
  badgeGreen:{background:"#F0FDF4",color:"#16A34A",border:"1px solid #BBF7D0",padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,display:"inline-block"},
  badgeBlue:{background:"#EFF6FF",color:"#2563EB",border:"1px solid #BFDBFE",padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,display:"inline-block"},
  badgeOrange:{background:"#FFF7ED",color:"#EA580C",border:"1px solid #FED7AA",padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,display:"inline-block"},
  badgeRed:{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,display:"inline-block"},
  badgeGold:{background:"#FFFBEB",color:"#D97706",border:"1px solid #FDE68A",padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,display:"inline-block"},
};

const UB=(r)=>({flex:1,padding:"18px 8px",background:"#fff",border:"none",borderRight:r?"1px solid #d4edda":"none",cursor:"pointer",textAlign:"center",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4});

function App(){
  const [sc,go]=useState("role");
  const [role,setRole]=useState(null); // "customer"|"driver"|"admin"
  const [user,setUser]=useState(null);
  const [bks,setBks]=useState([]);
  const [dft,setDft]=useState(null);
  const [msg,setMsg]=useState(null);
  const [sAc,setSAc]=useState("2");
  const [payAmt,setPayAmt]=useState(0);
  const [selKhet,setSelKhet]=useState(null); // selected khet for booking
  const [chatBk,setChatBk]=useState(null);

  const toast=m=>{setMsg(m);setTimeout(()=>setMsg(null),2400);};

  // Customer login
  const onLogin=ph=>{
    const u=DB.users[ph];
    setUser({phone:ph,...u});
    if(u){setBks(DB.bookings.filter(b=>b.ph===ph));go("home");toast("🙏 स्वागत है!");}
    else go("reg");
    // Supabase: try to load real profile
    sbGetUser(ph).then(su=>{if(su){DB.users[ph]={...DB.users[ph],...su};setUser(p=>({...p,...su}));}}).catch(()=>{});
  };
  const onReg=d=>{
    DB.users[d.phone]=d;
    setUser({...d});
    setBks([]);
    if(!DB.khets[d.phone]) DB.khets[d.phone]=[];
    if(d.sat712List&&d.sat712List.length>0){
      DB.khets[d.phone].push({
        id:"K"+Date.now(),
        name:"मेरा खेत (Registration)",
        village:d.village||"-",
        address:d.farmAddress||"-",
        acres:parseFloat(d.acres||1),
        sat712:[...d.sat712List],
        addedAt:new Date().toISOString(),
        bookings:0,lastService:"",lastDate:"",
        isDefault:true,
      });
    }
    // Supabase sync
    sbSaveUser(d).catch(()=>{});
    go("home");
    toast("🎉 Registration सफल!");
  };
  const onPaid=(ac,amt)=>{
    const u2={...user,sub:true,sA:ac,sAmt:amt};
    DB.users[user.phone]=u2;setUser(u2);
    // Supabase sync
    sbSaveUser({...u2,phone:user.phone}).catch(()=>{});
    sbSaveSubscription(user.phone,ac,amt).catch(()=>{});
    go("home");toast("🎉 Special Discount 50% Off Unlock!");
  };
  const onBook=b=>{
    const nb={...b,id:gid(),ph:user.phone,name:user.name,village:user.village||"-",address:user.farmAddress||"-",phone:user.phone,at:new Date().toISOString(),booking_status:"confirmed",payment_status:"paid",paidAt:new Date().toISOString(),status:"Pending",driverId:null,completionOtp:"1234"};
    DB.bookings.push(nb);
    setBks(DB.bookings.filter(x=>x.ph===user.phone));
    setDft(nb);
    // Supabase sync
    sbSaveBooking(nb).catch(()=>{});
    // Auto-assign tractor
    autoAssign(nb);
    go("ok");
  };

  // Driver login
  const onDriverLogin=ph=>{
    const d=DB.drivers[ph];
    setUser({phone:ph,...d});
    if(d){go("driverHome");toast("🚜 Driver Dashboard!");}
    else go("driverReg");
    sbGetDriver(ph).then(sd=>{if(sd){DB.drivers[ph]={...DB.drivers[ph],...sd};setUser(p=>({...p,...sd}));}}).catch(()=>{});
  };
  const onDriverReg=d=>{
    DB.drivers[d.phone]=d;
    setUser({...d});
    sbSaveDriver(d).catch(()=>{});
    registerTractor({...d});
    go("driverHome");
    toast("✅ Driver Registration सफल!");
  };

  const [selJob,setSelJob]=useState(null);
  const tryBook=()=>user?.sub?go("book"):go("plans");
  const logout=()=>{setUser(null);setBks([]);setRole(null);go("role");};
  // RBAC: nav has NO admin route — customers cannot reach admin
  const nav={home:()=>go("home"),book:tryBook,history:()=>go("history"),plans:()=>go("plans"),profile:()=>go("custProfile"),support:()=>go("custSupport"),notif:()=>go("custNotif"),khet:()=>go("meraKhet")};
  const dnav={home:()=>go("driverHome"),bookings:()=>go("driverBookings"),earnings:()=>go("driverEarnings"),leaderboard:()=>go("driverBoard"),incentive:()=>go("driverInc")};

  const openChat=bk=>{setChatBk(bk);go("chat");};

  return(
    <div style={S.page}>
      <style>{`
        @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes sp{to{transform:rotate(360deg)}}
        @keyframes pw{from{width:0}to{width:100%}}
        @keyframes bb{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes pop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
        .fi{animation:fi .3s ease}
        .hd{position:absolute;right:12px;bottom:4px;font-size:66px;opacity:.12;transform:scaleX(-1)}
        .nb{display:flex;flex-direction:column;align-items:center;gap:2px;color:#9ab5a3;cursor:pointer;padding:4px 12px;font-size:11px;font-weight:700;border:none;background:none;font-family:inherit}
        .nb.on{color:#2d8a4e}
        .dnb{display:flex;flex-direction:column;align-items:center;gap:2px;color:#9ab5a3;cursor:pointer;padding:4px 12px;font-size:11px;font-weight:700;border:none;background:none;font-family:inherit}
        .dnb.on{color:#1565c0}
        .sv{display:flex;align-items:center;gap:10px;padding:12px;border:2px solid #d4edda;border-radius:13px;cursor:pointer;background:#fff;margin-bottom:8px}
        .sv:hover,.sv.on{border-color:#2d8a4e;background:#e8f5e9}
      `}</style>
      {msg&&<div style={{position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",background:"#1a6b38",color:"#fff",padding:"10px 20px",borderRadius:10,fontWeight:700,fontSize:14,zIndex:999,whiteSpace:"nowrap",animation:"fi .25s ease"}}>{msg}</div>}

      {sc==="role"        && <RoleSelect onSelect={r=>{setRole(r);go(r==="customer"?"login":r==="driver"?"driverLogin":"admin");}}/>}
      {sc==="login"       && <Login      onLogin={onLogin}/>}
      {sc==="reg"         && <Reg        phone={user?.phone} onDone={onReg} back={()=>go("login")}/>}
      {sc==="home"        && <Home       user={user} bks={bks} nav={nav} logout={logout} goP={()=>go("plans")} openChat={openChat}/>}
      {sc==="plans"       && <Plans      user={user} ac={sAc} setAc={setSAc} onPay={(a,m)=>{setSAc(a);setPayAmt(m||0);go("pay");}} back={()=>go("home")}/>}
      {sc==="pay"         && <Pay        ac={sAc} amt={payAmt} user={user} onSuccess={onPaid} back={()=>go("plans")}/>}
      {sc==="book"        && <Book       user={user} selKhet={selKhet} setSelKhet={setSelKhet} onNext={b=>{setDft(b);go("confirm");}} back={()=>go("home")}/>}
      {sc==="confirm"     && <Confirm    dft={dft} onOk={onBook} back={()=>go("book")}/>}
      {sc==="ok"          && <OK         dft={dft} nav={nav} onRate={()=>go("rating")}/>}
      {sc==="ok"          && <OK         dft={dft} nav={nav}/>}
      {sc==="history"     && <History    bks={bks} nav={nav} tryBook={tryBook} openChat={openChat} user={user}/>}
      {sc==="meraKhet"   && <MeraKhet   user={user} nav={nav} onSelectKhet={k=>{setSelKhet(k);tryBook();}}/>}
      {sc==="rating"      && <RatingScreen booking={dft} user={user} onDone={()=>{setDft(null);go("history");}}/>}
      {sc==="chat"        && <Chat       booking={chatBk} user={user} role={role} back={()=>go(role==="driver"?"driverBookings":"history")}/>}
      {sc==="driverLogin" && <DriverLogin onLogin={onDriverLogin} back={()=>go("role")}/>}
      {sc==="driverReg"   && <DriverReg  phone={user?.phone} onDone={onDriverReg} back={()=>go("driverLogin")}/>}
      {sc==="driverHome"  && <DriverHome driver={user} dnav={dnav} logout={logout} openChat={b=>{setChatBk(b);go("chat");}} onJob={j=>{setSelJob(j);go("driverJobDetail");}}/>}
      {sc==="driverBookings"&&<DriverBookings driver={user} dnav={dnav} openChat={b=>{setChatBk(b);go("chat");}} onJob={j=>{setSelJob(j);go("driverJobDetail");}}/>}
      {sc==="driverJobDetail"&&<DriverJobDetail job={selJob} driver={user} setDriver={setUser} back={()=>go("driverBookings")} onComplete={()=>{setSelJob(null);go("driverHome");}}/>}
      {sc==="driverEarnings"&&<DriverEarnings driver={user} dnav={dnav}/>}
      {sc==="driverBoard" && <DriverLeaderboard driver={user} dnav={dnav}/>}
      {sc==="driverInc"   && <DriverIncentive  driver={user} dnav={dnav}/>}
      {sc==="custProfile" && role==="customer" && <CustProfile user={user} nav={nav} logout={logout}/>}
      {sc==="custNotif"   && role==="customer" && <CustNotif   nav={nav}/>}
      {sc==="custSupport" && role==="customer" && <CustSupport nav={{...nav,home:()=>go("home"),history:()=>go("history"),book:tryBook,plans:()=>go("plans"),profile:()=>go("custProfile"),notif:()=>go("custNotif"),support:()=>go("custSupport")}}/>}
      {sc==="admin"       && role==="admin"    && <AdminPanel  back={()=>go("role")}/>}
      {sc==="admin"       && role!=="admin"    && role==="customer" && go("home")&&null}
      {sc==="admin"       && role!=="admin"    && role==="driver"   && go("driverHome")&&null}
    </div>
  );
}

// ═══ ROLE SELECT ═══════════════════════════════════════════════════════════
function RoleSelect({onSelect}){return(
  <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#f0fdf4 0%,#dcfce7 40%,#f8fafc 100%)",display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 0 40px"}}>
    <div style={{textAlign:"center",padding:"56px 24px 28px"}}>
      <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:78,height:78,borderRadius:22,background:"linear-gradient(135deg,#16a34a,#14532d)",boxShadow:"0 16px 48px rgba(22,163,74,.35)",marginBottom:18,animation:"bb 2s ease-in-out infinite"}}>
        <span style={{fontSize:36}}>🚜</span>
      </div>
      <h1 style={{fontSize:30,fontWeight:900,color:"#14532d",margin:"0 0 6px",letterSpacing:"-.5px"}}>KisanSetu</h1>
      <p style={{fontSize:14,color:"#15803d",fontWeight:600,margin:"0 0 14px"}}>India's Smart Tractor Booking Platform</p>
      <div style={{display:"flex",justifyContent:"center",gap:7,flexWrap:"wrap"}}>
        {["✅ Verified","🌾 Pan-India","⭐ 4.9 Rated","🔒 Secure"].map(t=>(
          <span key={t} style={{background:"rgba(22,163,74,.1)",color:"#15803d",padding:"3px 10px",borderRadius:999,fontSize:10,fontWeight:700,border:"1px solid #bbf7d0"}}>{t}</span>
        ))}
      </div>
    </div>
    <div style={{padding:"0 18px",maxWidth:420,margin:"0 auto",width:"100%"}} className="fi">
      {[{r:"customer",ico:"👨‍🌾",bg:"linear-gradient(135deg,#16a34a,#15803d)",title:"Kisan / Farmer",sub:"Tractor service book karein • 50% off subscription",badge:"₹550/Ac Plans"},
        {r:"driver",ico:"🚜",bg:"linear-gradient(135deg,#1e40af,#1d4ed8)",title:"Driver / Tractor Owner",sub:"Jobs accept karein • ₹2.25 Crore incentive pool",badge:"Top Earners"},
        {r:"admin",ico:"📊",bg:"linear-gradient(135deg,#374151,#111827)",title:"Admin Panel",sub:"Complete management & analytics dashboard",badge:"Authorized Only"},
      ].map(({r,ico,bg,title,sub,badge},i)=>(
        <button key={r} onClick={()=>onSelect(r)}
          style={{width:"100%",display:"flex",alignItems:"center",gap:16,padding:"16px 18px",borderRadius:20,border:"1px solid rgba(0,0,0,.05)",background:"#fff",cursor:"pointer",fontFamily:"inherit",marginBottom:10,boxShadow:"0 4px 20px rgba(0,0,0,.06)",textAlign:"left"}}>
          <div style={{width:50,height:50,borderRadius:15,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:23,flexShrink:0,boxShadow:"0 4px 12px rgba(0,0,0,.18)"}}>
            {ico}
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:"0 0 3px"}}>{title}</p>
            <p style={{fontSize:11,color:"#64748b",margin:0,lineHeight:1.4}}>{sub}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
            <span style={{fontSize:22,color:"#cbd5e1"}}>›</span>
            <span style={{fontSize:9,background:"#f0fdf4",color:"#16a34a",padding:"2px 7px",borderRadius:999,fontWeight:700,border:"1px solid #bbf7d0",whiteSpace:"nowrap"}}>{badge}</span>
          </div>
        </button>
      ))}
    </div>
    <p style={{textAlign:"center",fontSize:11,color:"#86efac",marginTop:6}}>Secured by 256-bit SSL Encryption</p>
  </div>
);}
// ═══ CUSTOMER LOGIN ════════════════════════════════════════════════════════
function Login({onLogin}){
  const [step,ss]=useState("ph");
  const [ph,setPh]=useState("");
  const [otp,setOtp]=useState(["","","","","",""]);
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState("");
  const refs=useRef([]);
  const send=()=>{if(ph.length!==10){setErr("10 digit number");return;}setBusy(true);setErr("");setTimeout(()=>{setBusy(false);ss("otp");setOtp(["1","2","3","4","5","6"]);},900);};
  const verify=()=>{if(otp.join("")!=="123456"){setErr("गलत OTP");return;}setBusy(true);setTimeout(()=>{setBusy(false);onLogin(ph);},500);};
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"24px 18px",background:"linear-gradient(170deg,#e8f5e9,#f0faf0 60%,#fff)"}}>
      <div className="fi" style={{maxWidth:400,margin:"0 auto",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:48}}>👨‍🌾</div>
          <h1 style={{fontSize:22,fontWeight:900,color:"#1a6b38",margin:"7px 0 3px"}}>किसान Login</h1>
        </div>
        <div style={S.card}>
          {step==="ph"?(<>
            <label style={S.lbl}>📱 Mobile Number</label>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <div style={{background:"#e8f5e9",borderRadius:14,padding:13,fontWeight:800,color:"#1a6b38",border:"2px solid #d4edda"}}>+91</div>
              <input style={{...S.inp,flex:1}} placeholder="10-digit number" inputMode="numeric" value={ph} onChange={e=>setPh(e.target.value.replace(/\D/g,"").slice(0,10))} onKeyDown={e=>e.key==="Enter"&&send()}/>
            </div>
            {err&&<p style={{color:"#EF4444",fontSize:13,marginBottom:8}}>⚠️ {err}</p>}
            <button style={S.btnG} onClick={send} disabled={busy}>{busy?"📤 भेज रहे हैं...":"📨 OTP भेजें"}</button>
            <p style={{textAlign:"center",fontSize:12,color:"#9ab5a3",marginTop:8}}>Demo OTP: <b>123456</b></p>
          </>):(<>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
              <button onClick={()=>ss("ph")} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#2d8a4e"}}>←</button>
              <div><h2 style={{fontSize:17,fontWeight:800}}>OTP Verify</h2><p style={{color:"#7a9e8a",fontSize:12}}>+91 {ph}</p></div>
            </div>
            <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:14}}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>refs.current[i]=el}
                  style={{width:43,height:52,border:`2px solid ${d?"#2d8a4e":"#d4edda"}`,borderRadius:10,textAlign:"center",fontSize:21,fontWeight:800,color:"#1a3d2a",background:"#fafffe",outline:"none"}}
                  maxLength={1} value={d} inputMode="numeric"
                  onChange={e=>{if(!/^\d?$/.test(e.target.value))return;const n=[...otp];n[i]=e.target.value;setOtp(n);if(e.target.value&&i<5)refs.current[i+1]?.focus();}}
                  onKeyDown={e=>e.key==="Backspace"&&!d&&i>0&&refs.current[i-1]?.focus()}/>
              ))}
            </div>
            {err&&<p style={{color:"#EF4444",fontSize:13,marginBottom:8}}>⚠️ {err}</p>}
            <button style={S.btnG} onClick={verify} disabled={busy}>{busy?"⏳...":"✅ Verify & Login"}</button>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ─── FormField outside = no remount ───────────────────────────────────────
function FF({label,ico,type="text",val,onChange,err,ph}){
  return(<div style={{marginBottom:11}}>
    <label style={S.lbl}>{ico} {label}</label>
    <input style={S.inp} type={type} inputMode={type==="tel"?"numeric":"text"} placeholder={ph||label} value={val} onChange={onChange}/>
    {err&&<p style={{color:"#EF4444",fontSize:12,marginTop:4}}>⚠️ {err}</p>}
  </div>);
}

// ─── Upload ───────────────────────────────────────────────────────────────
function Upload({label,ico,val,err,onPick,onRm,preview}){
  const [loading,setL]=useState(false);
  const pick=t=>{setL(true);setTimeout(()=>{setL(false);onPick(t);},1400);};
  return(
    <div style={{marginBottom:18}}>
      <label style={S.lbl}>{ico} {label}</label>
      {loading&&(
        <div style={{border:"2px solid #9fd4af",borderRadius:12,padding:"20px",background:"#f6fef8",textAlign:"center"}}>
          <div style={{fontSize:30,marginBottom:8,display:"inline-block",animation:"sp 1s linear infinite"}}>🔄</div>
          <p style={{fontWeight:700,color:"#2d8a4e",fontSize:13}}>Upload हो रहा है...</p>
          <div style={{marginTop:10,background:"#c8e6c9",borderRadius:999,height:6,overflow:"hidden"}}>
            <div style={{height:"100%",background:"#2d8a4e",borderRadius:999,animation:"pw 1.4s linear forwards"}}/>
          </div>
        </div>
      )}
      {!loading&&val&&(
        <div>
          {preview}
          <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
            <div style={{flex:1,background:"#F0FDF4",borderRadius:12,padding:"10px 14px",border:"1px solid #BBF7D0"}}><p style={{fontWeight:700,color:"#16A34A",fontSize:13}}>✅ Upload सफल! ({val})</p></div>
            <button onClick={onRm} style={{background:"#ffcdd2",border:"none",borderRadius:12,padding:"9px 12px",cursor:"pointer",fontWeight:700,color:"#c62828",fontFamily:"inherit"}}>🗑️</button>
          </div>
          {err&&<p style={{color:"#EF4444",fontSize:12,marginTop:4}}>⚠️ {err}</p>}
        </div>
      )}
      {!loading&&!val&&(
        <div style={{border:"1.5px dashed #86EFAC",borderRadius:16,overflow:"hidden",background:"#FAFFFE"}}>
          <div style={{background:"#e8f5e9",padding:"9px 12px",textAlign:"center",borderBottom:"1px solid #c8e6c9"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#1a6b38"}}>👇 Koi bhi button dabao</p>
          </div>
          <div style={{display:"flex"}}>
            <button onClick={()=>pick("Camera")} style={UB(true)}><span style={{fontSize:32}}>📷</span><span style={{fontSize:13,fontWeight:700,color:"#1a3d2a"}}>Camera</span><span style={{fontSize:11,color:"#7a9e8a"}}>Photo lo</span></button>
            <button onClick={()=>pick("Gallery")} style={UB(true)}><span style={{fontSize:32}}>🖼️</span><span style={{fontSize:13,fontWeight:700,color:"#1a3d2a"}}>Gallery</span><span style={{fontSize:11,color:"#7a9e8a"}}>Select karo</span></button>
            <button onClick={()=>pick("PDF")} style={UB(false)}><span style={{fontSize:32}}>📄</span><span style={{fontSize:13,fontWeight:700,color:"#1a3d2a"}}>PDF</span><span style={{fontSize:11,color:"#7a9e8a"}}>Upload karo</span></button>
          </div>
          <div style={{background:"#fffde7",padding:"5px 12px",borderTop:"1px solid #ffe082",textAlign:"center"}}>
            <p style={{fontSize:11,color:"#8a6000"}}>👆 Tap → document preview dikhega ✅</p>
          </div>
        </div>
      )}
      {!val&&!loading&&err&&<p style={{color:"#EF4444",fontSize:12,marginTop:4}}>⚠️ {err}</p>}
    </div>
  );
}

// ─── Document Preview Cards ───────────────────────────────────────────────
function AadCard({name}){return(
  <div style={{borderRadius:14,overflow:"hidden",border:"2px solid #90caf9",marginBottom:4}}>
    <div style={{background:"linear-gradient(135deg,#1a237e,#283593)",padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:24,height:24,borderRadius:"50%",background:"#ff9800",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>🇮🇳</div>
      <p style={{color:"#fff",fontSize:11,fontWeight:800,flex:1}}>GOVT OF INDIA • भारत सरकार</p>
      <p style={{color:"#90caf9",fontSize:11,fontWeight:800}}>आधार</p>
    </div>
    <div style={{background:"#fff",padding:"10px 12px",display:"flex",gap:10,alignItems:"center"}}>
      <div style={{width:52,height:64,borderRadius:12,background:"linear-gradient(135deg,#e3f2fd,#bbdefb)",border:"2px solid #90caf9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>👨‍🌾</div>
      <div>
        <p style={{fontSize:13,fontWeight:900,color:"#1a237e"}}>{(name||"Pankaj Raut").toUpperCase()}</p>
        <p style={{fontSize:11,color:"#555",marginTop:2}}>DOB: 15/08/1990 | Male</p>
        <p style={{fontSize:11,color:"#555"}}>Chandrapur, Maharashtra</p>
        <div style={{marginTop:5,background:"#e8f5e9",borderRadius:6,padding:"3px 8px",display:"inline-block"}}>
          <p style={{fontSize:13,fontWeight:900,color:"#1a3d2a",letterSpacing:3}}>XXXX XXXX 4782</p>
        </div>
      </div>
    </div>
  </div>
);}

function SatCard({vil,acres}){return(
  <div style={{borderRadius:14,overflow:"hidden",border:"2px solid #ffcc80",marginBottom:4}}>
    <div style={{background:"linear-gradient(135deg,#e65100,#bf360c)",padding:"8px 12px",textAlign:"center"}}>
      <p style={{color:"#fff",fontSize:11,fontWeight:800}}>महाराष्ट्र शासन • 7/12 Utara</p>
    </div>
    <div style={{background:"#fffde7",padding:"10px 12px"}}>
      {[["जिल्हा","Chandrapur"],["गाव",vil||"—"],["क्षेत्रफळ",acres?`${acres} Acres`:"—"],["धारकाचे नाव","Pankaj Dinkar Raut"]].map(([k,v])=>(
        <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px dotted #e0d8b0"}}>
          <span style={{fontSize:11,color:"#795548",fontWeight:600}}>{k}</span>
          <span style={{fontSize:11,color:"#212121",fontWeight:700}}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);}

// ═══ CUSTOMER REGISTRATION ═════════════════════════════════════════════════
function Reg({phone,onDone,back}){
  const [name,setName]=useState(""); const [farm,setFarm]=useState(""); const [mob,setMob]=useState(phone||"");
  const [vil,setVil]=useState(""); const [acres,setAcres]=useState("");
  const [aad,setAad]=useState(null);
  const [satList,setSatList]=useState([]);
  const [satUploading,setSatUpl]=useState(false);
  // Form for each new 7/12 entry — requires village + acres + upload
  const [satForm,setSatForm]=useState({village:"",acres:"",src:null});
  const [satFormErr,setSatFormErr]=useState({});
  const [showSatForm,setShowSatForm]=useState(false);
  const [errs,setErrs]=useState({}); const [busy,setBusy]=useState(false); const [prog,setProg]=useState("");
  const clr=k=>setErrs(p=>({...p,[k]:""}));

  const startUpload=(src)=>{
    // Validate village + acres first
    const e={};
    if(!satForm.village.trim()) e.village="Village/Gaon zaruri hai";
    if(!satForm.acres||parseFloat(satForm.acres)<=0) e.acres="Acres zaruri hai";
    if(Object.keys(e).length){setSatFormErr(e);return;}
    setSatFormErr({});
    setSatUpl(true);
    setTimeout(()=>{
      setSatList(p=>[...p,{
        id:Date.now(),
        village:satForm.village.trim(),
        acres:parseFloat(satForm.acres),
        src, label:`7/12 #${p.length+1} (${src})`,
        uploadedAt:new Date().toISOString(),
      }]);
      setSatUpl(false);
      setSatForm({village:"",acres:"",src:null});
      setShowSatForm(false);
      clr("sat");
    },1400);
  };

  const submit=()=>{
    const e={};
    if(!name.trim())e.name="जरूरी"; if(!farm.trim())e.farm="जरूरी";
    if(mob.length!==10)e.mob="10 digit"; if(!aad)e.aad="Upload करें";
    if(satList.length===0)e.sat="कम से कम 1 7/12 Upload करें";
    if(Object.keys(e).length){setErrs(e);return;}
    setBusy(true);setProg("📤 Aadhaar upload...");
    setTimeout(()=>{setProg("📤 7/12 upload...");setTimeout(()=>{setProg("💾 Saving...");setTimeout(()=>{
      setBusy(false);setProg("");
      onDone({name,farmAddress:farm,phone:mob,village:vil,
        acres: satList.length>0 ? Math.max(...satList.map(d=>parseFloat(d.acres)||0)) : (parseFloat(acres)||0),
        aadDone:true,satDone:true,sat712List:satList});
    },500);},700);},900);
  };

  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={S.hdr}><div className="hd">🚜</div>
        <button style={S.bkb} onClick={back}>← Back</button>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>📋 Customer Registration</h1>
      </div>
      <div style={{padding:"16px 15px 100px"}} className="fi">
        <div style={S.card}>
          <h3 style={{fontSize:15,fontWeight:800,color:"#14532D",marginBottom:14,letterSpacing:"-.2px"}}>👤 Personal Details</h3>
          <FF label="पूरा नाम" ico="👤" val={name} onChange={e=>{setName(e.target.value);clr("name");}} err={errs.name}/>
          <FF label="खेती का पता" ico="🌾" ph="खेत — गाव, तालुका, जिल्हा" val={farm} onChange={e=>{setFarm(e.target.value);clr("farm");}} err={errs.farm}/>
          <FF label="Mobile" ico="📱" type="tel" val={mob} onChange={e=>{setMob(e.target.value.replace(/\D/g,"").slice(0,10));clr("mob");}} err={errs.mob}/>
          <FF label="गाव / Village" ico="🏘️" val={vil} onChange={e=>setVil(e.target.value)}/>
          <div><label style={S.lbl}>🌾 Acres (7/12 के अनुसार)</label>
            <input style={S.inp} type="number" min=".5" step=".5" value={acres} onChange={e=>setAcres(e.target.value)}/></div>
        </div>
        <div style={S.card}>
          <h3 style={{fontSize:15,fontWeight:800,color:"#14532D",marginBottom:14,letterSpacing:"-.2px"}}>📄 Documents</h3>
          <Upload label="Aadhaar Card" ico="🪪" val={aad} err={errs.aad} onPick={t=>{setAad(t);clr("aad");}} onRm={()=>setAad(null)} preview={aad&&<AadCard name={name}/>}/>

          {/* ── MULTI 7/12 UPLOAD — each entry has village + acres ── */}
          <label style={S.lbl}>📜 7/12 Utara (Farm-wise)</label>

          {/* Saved entries — show village + acres + doc */}
          {satList.map((d,i)=>(
            <div key={d.id} style={{background:"#e8f5e9",borderRadius:10,padding:"11px 13px",marginBottom:8,border:"1.5px solid #a5d6a7"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <p style={{fontWeight:800,fontSize:13,color:"#1a6b38"}}>🌾 Farm #{i+1} — 7/12 Uploaded ✅</p>
                  <p style={{fontSize:12,color:"#4a7c5a",marginTop:3}}>📍 Village: <b>{d.village}</b></p>
                  <p style={{fontSize:12,color:"#4a7c5a"}}>🌾 Area: <b>{d.acres} Acre</b></p>
                  <p style={{fontSize:11,color:"#7a9e8a",marginTop:2}}>📎 {d.src} • {new Date(d.uploadedAt).toLocaleDateString("en-IN")}</p>
                </div>
                <button onClick={()=>setSatList(p=>p.filter(x=>x.id!==d.id))}
                  style={{background:"#ffcdd2",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",color:"#c62828",fontWeight:800,fontFamily:"inherit",fontSize:12,flexShrink:0}}>🗑️</button>
              </div>
            </div>
          ))}

          {/* Form to add new 7/12 entry */}
          {showSatForm&&!satUploading&&(
            <div style={{border:"2px solid #2d8a4e",borderRadius:12,padding:14,marginBottom:10,background:"#f6fef8"}}>
              <p style={{fontSize:13,fontWeight:800,color:"#1a6b38",marginBottom:10}}>
                {satList.length===0?"📜 Pehla 7/12 Add karein":"➕ Naya 7/12 Add karein"}
              </p>
              {/* Village — Required */}
              <div style={{marginBottom:10}}>
                <label style={S.lbl}>🏘️ Village / Gaon <span style={{color:"#c62828"}}>*</span></label>
                <input style={{...S.inp,borderColor:satFormErr.village?"#c62828":"#d4edda"}}
                  placeholder="eg: Dewada, Nagpur" value={satForm.village}
                  onChange={e=>{setSatForm(p=>({...p,village:e.target.value}));setSatFormErr(p=>({...p,village:""}));}}/>
                {satFormErr.village&&<p style={{color:"#EF4444",fontSize:12,marginTop:3}}>⚠️ {satFormErr.village}</p>}
              </div>
              {/* Acres — Required */}
              <div style={{marginBottom:12}}>
                <label style={S.lbl}>🌾 Total Acres <span style={{color:"#c62828"}}>*</span></label>
                <input style={{...S.inp,borderColor:satFormErr.acres?"#c62828":"#d4edda"}}
                  type="number" min=".5" step=".5" placeholder="eg: 3.5"
                  value={satForm.acres}
                  onChange={e=>{setSatForm(p=>({...p,acres:e.target.value}));setSatFormErr(p=>({...p,acres:""}));}}/>
                {satFormErr.acres&&<p style={{color:"#EF4444",fontSize:12,marginTop:3}}>⚠️ {satFormErr.acres}</p>}
              </div>
              {/* Upload — Required */}
              <label style={S.lbl}>📜 7/12 Upload karein <span style={{color:"#c62828"}}>*</span></label>
              <div style={{border:"1.5px dashed #2d8a4e",borderRadius:10,overflow:"hidden",marginBottom:8}}>
                <div style={{display:"flex"}}>
                  {[["📷","Camera"],["🖼️","Gallery"],["📄","PDF"]].map(([ico,l],idx,arr)=>(
                    <button key={l} onClick={()=>startUpload(l)}
                      style={{flex:1,padding:"14px 6px",background:"#fff",border:"none",
                        borderRight:idx<arr.length-1?"1px solid #d4edda":"none",
                        cursor:"pointer",textAlign:"center",fontFamily:"inherit",
                        display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <span style={{fontSize:26}}>{ico}</span>
                      <span style={{fontSize:11,fontWeight:700,color:"#1a3d2a"}}>{l}</span>
                    </button>
                  ))}
                </div>
                <div style={{background:"#fffde7",padding:"5px",textAlign:"center",borderTop:"1px solid #ffe082"}}>
                  <p style={{fontSize:11,color:"#8a6000"}}>Village + Acres bhar ke koi bhi tap karein ✅</p>
                </div>
              </div>
              <button onClick={()=>{setShowSatForm(false);setSatForm({village:"",acres:"",src:null});setSatFormErr({});}}
                style={{background:"none",border:"none",color:"#c62828",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:12}}>✕ Cancel</button>
            </div>
          )}

          {/* Upload spinner */}
          {satUploading&&<div style={{background:"#e8f5e9",borderRadius:12,padding:"12px",marginBottom:8,textAlign:"center",border:"1.5px solid #a5d6a7"}}>
            <div style={{fontSize:24,display:"inline-block",animation:"sp 1s linear infinite"}}>🔄</div>
            <p style={{fontSize:12,color:"#1a6b38",fontWeight:700,marginTop:6}}>7/12 Upload ho raha hai...</p>
            <div style={{marginTop:8,background:"#c8e6c9",borderRadius:999,height:5,overflow:"hidden"}}><div style={{height:"100%",background:"#2d8a4e",borderRadius:999,animation:"pw 1.4s linear forwards"}}/></div>
          </div>}

          {/* Button to open form */}
          {!showSatForm&&!satUploading&&(
            <button onClick={()=>setShowSatForm(true)}
              style={{width:"100%",background:satList.length===0?"linear-gradient(135deg,#2d8a4e,#1a6b38)":"#e8f5e9",
                color:satList.length===0?"#fff":"#1a6b38",
                border:satList.length===0?"none":"2px solid #2d8a4e",
                borderRadius:10,padding:"12px",cursor:"pointer",fontWeight:800,
                fontFamily:"inherit",fontSize:14,marginBottom:6,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:20}}>{satList.length===0?"📜":"➕"}</span>
              {satList.length===0?"7/12 Utara Add karein":"➕ Add Another 7/12 Utara"}
            </button>
          )}
          {satList.length>0&&!showSatForm&&<p style={{fontSize:11,color:"#4a7c5a",textAlign:"center",marginBottom:6}}>{satList.length} farm{satList.length>1?"s":""} added ✅</p>}
          {errs.sat&&<p style={{color:"#EF4444",fontSize:12,marginTop:2}}>⚠️ {errs.sat}</p>}
        </div>
        {busy&&<div style={{background:"#e8f5e9",borderRadius:12,padding:14,marginBottom:12,textAlign:"center",border:"2px solid #a5d6a7"}}>
          <div style={{fontSize:26,marginBottom:7,display:"inline-block",animation:"sp 1s linear infinite"}}>🔄</div>
          <p style={{fontWeight:700,color:"#1a6b38"}}>{prog}</p>
          <div style={{marginTop:9,background:"#c8e6c9",borderRadius:999,height:6,overflow:"hidden"}}><div style={{height:"100%",background:"#2d8a4e",borderRadius:999,animation:"pw 2.4s linear forwards"}}/></div>
        </div>}
        <button style={S.btnG} onClick={submit} disabled={busy}>{busy?"⏳ Processing...":"✅ Registration Complete करें"}</button>
      </div>
    </div>
  );
}

// ═══ HOME ══════════════════════════════════════════════════════════════════
function Home({user,bks,nav,logout,goP,openChat}){
  const sub       = user?.sub;
  const ac        = parseFloat(user?.acres||0);
  const subAc     = parseFloat(user?.sA||0);
  const normTotal = Math.round(ac*N_TOT);
  const saving    = Math.round(subAc*(N_TOT-S_TOT));
  const uid       = user?.phone||"guest";
  const myKhets   = DB.khets?.[uid]||[];
  const confirmed = bks.filter(b=>b.booking_status==="confirmed"&&b.payment_status==="paid");

  return(
    <div style={{background:"#F0F4F0",minHeight:"100vh",paddingBottom:120,fontFamily:"'Inter','Segoe UI',sans-serif"}}>

      {/* ══ HERO HEADER ══════════════════════════════════════════════════ */}
      <div style={{background:"linear-gradient(145deg,#052e16,#14532d,#166534)",padding:"56px 22px 100px",position:"relative",overflow:"hidden"}}>
        {[{w:220,h:220,t:-60,r:-60,o:.07},{w:160,h:160,b:-50,l:-40,o:.05},{w:100,h:100,t:80,r:40,o:.04}].map((b2,i)=>(
          <div key={i} style={{position:"absolute",width:b2.w,height:b2.h,borderRadius:"50%",background:"rgba(255,255,255,"+b2.o+")",top:b2.t,right:b2.r,bottom:b2.b,left:b2.l}}/>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:2,marginBottom:20}}>
          <div>
            <p style={{color:"rgba(134,239,172,.8)",fontSize:12,fontWeight:600,margin:"0 0 6px",letterSpacing:1,textTransform:"uppercase"}}>Welcome back 👋</p>
            <h1 style={{color:"#fff",fontSize:28,fontWeight:900,margin:"0 0 6px",letterSpacing:"-.5px",lineHeight:1.1}}>{user?.name||"Kisan"}</h1>
            <p style={{color:"rgba(255,255,255,.5)",fontSize:12,margin:0,fontWeight:500}}>
              {user?.phone?`+91 ${user.phone}`:""}
              {user?.village?` · ${user.village}`:""}
            </p>
          </div>
          <button onClick={logout} style={{background:"rgba(255,255,255,.1)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.18)",color:"rgba(255,255,255,.85)",padding:"9px 16px",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap"}}>
            Sign Out
          </button>
        </div>
        {/* Status chips */}
        <div style={{display:"flex",gap:8,position:"relative",zIndex:2,flexWrap:"wrap"}}>
          {sub
            ?<div style={{background:"rgba(74,222,128,.18)",border:"1px solid rgba(74,222,128,.35)",backdropFilter:"blur(8px)",color:"#86efac",padding:"6px 14px",borderRadius:999,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>
                Subscription Active · {user.sA} Acres
              </div>
            :<div onClick={goP} style={{background:"rgba(251,191,36,.15)",border:"1px solid rgba(251,191,36,.3)",color:"#fbbf24",padding:"6px 14px",borderRadius:999,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                <span>⚡</span> Subscribe · 50% Off Available
              </div>}
          <div style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.7)",padding:"6px 14px",borderRadius:999,fontSize:11,fontWeight:600}}>
            🌾 {myKhets.length} Farm{myKhets.length!==1?"s":""}
          </div>
        </div>
      </div>

      {/* ══ FLOATING KPI CARDS (overlap header) ══════════════════════════ */}
      <div style={{margin:"-50px 16px 0",position:"relative",zIndex:10}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            {ico:"📋",label:"Bookings",val:confirmed.length,  accent:"#2563EB",light:"#EFF6FF"},
            {ico:"🌾",label:"Acres",   val:ac?`${ac}Ac`:"—",  accent:"#16A34A",light:"#F0FDF4"},
            {ico:"💰",label:"Saved",   val:sub&&saving>0?`₹${(saving/1000).toFixed(0)}K`:"—", accent:"#D97706",light:"#FFFBEB"},
          ].map(k=>(
            <div key={k.label} style={{background:"#fff",borderRadius:20,padding:"16px 10px",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,.12)",border:"1px solid rgba(0,0,0,.04)"}}>
              <div style={{width:38,height:38,borderRadius:12,background:k.light,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,margin:"0 auto 8px",border:`1px solid ${k.accent}22`}}>{k.ico}</div>
              <p style={{fontSize:17,fontWeight:900,color:k.accent,margin:"0 0 2px"}}>{k.val}</p>
              <p style={{fontSize:10,color:"#94A3B8",fontWeight:600,margin:0,textTransform:"uppercase",letterSpacing:.5}}>{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"20px 16px 0"}}>

        {/* ══ SUBSCRIPTION / CTA CARD ══════════════════════════════════════ */}
        {!sub?(
          <div onClick={goP} style={{background:"linear-gradient(135deg,#7F1D1D,#B91C1C,#DC2626)",borderRadius:24,padding:"20px 20px",marginBottom:20,cursor:"pointer",boxShadow:"0 12px 40px rgba(185,28,28,.3)",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-24,top:-24,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
            <div style={{position:"absolute",right:20,bottom:-30,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <span style={{background:"rgba(255,255,255,.18)",color:"#fff",padding:"3px 12px",borderRadius:999,fontSize:10,fontWeight:800,letterSpacing:.8,textTransform:"uppercase"}}>🔥 Limited Offer</span>
              <h3 style={{fontSize:22,fontWeight:900,color:"#fff",margin:"10px 0 6px",letterSpacing:"-.4px"}}>50% Off पाएं!</h3>
              <p style={{fontSize:13,color:"rgba(255,255,255,.7)",margin:"0 0 16px",lineHeight:1.5}}>
                Normal ₹{normTotal.toLocaleString("en-IN")} → Sirf ₹{Math.round(ac*S_TOT).toLocaleString("en-IN")}/visit
              </p>
              <div style={{background:"#fff",color:"#DC2626",borderRadius:14,padding:"11px 18px",fontWeight:900,fontSize:14,display:"inline-flex",alignItems:"center",gap:6}}>
                Subscribe Now ›
              </div>
            </div>
          </div>
        ):(
          <div style={{background:"linear-gradient(135deg,#052e16,#14532d)",borderRadius:24,padding:"18px 20px",marginBottom:20,boxShadow:"0 12px 40px rgba(5,46,22,.3)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{color:"rgba(134,239,172,.7)",fontSize:11,fontWeight:700,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>Active Plan</p>
                <p style={{color:"#fff",fontSize:22,fontWeight:900,margin:"0 0 4px"}}>₹{user.subAmt?.toLocaleString("en-IN")}/year</p>
                <p style={{color:"rgba(255,255,255,.5)",fontSize:12,margin:0}}>{user.sA} Acres · 50% Off on all services</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{color:"rgba(134,239,172,.7)",fontSize:11,fontWeight:600,margin:"0 0 4px"}}>Annual savings</p>
                <p style={{color:"#4ade80",fontSize:22,fontWeight:900,margin:0}}>₹{saving.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        )}

        {/* ══ MAIN ACTION GRID ══════════════════════════════════════════════ */}
        <div style={{marginBottom:24}}>
          <p style={{fontSize:11,fontWeight:700,color:"#64748B",margin:"0 0 12px",textTransform:"uppercase",letterSpacing:1}}>Quick Actions</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[
              {ico:"🚜",label:"Book Tractor",sub:"Request a service",bg:"linear-gradient(145deg,#16A34A,#15803D)",sh:"rgba(22,163,74,.3)",fn:nav.book},
              {ico:"📋",label:"My Bookings",sub:"Track all orders",bg:"linear-gradient(145deg,#2563EB,#1D4ED8)",sh:"rgba(37,99,235,.25)",fn:nav.history},
              {ico:"🌾",label:"Mera Khet",sub:"Manage farms",bg:"linear-gradient(145deg,#D97706,#B45309)",sh:"rgba(217,119,6,.25)",fn:nav.khet},
              {ico:"⭐",label:"Subscription",sub:"Plans & pricing",bg:"linear-gradient(145deg,#7C3AED,#6D28D9)",sh:"rgba(124,58,237,.25)",fn:goP},
            ].map(a=>(
              <button key={a.label} onClick={a.fn}
                style={{background:a.bg,borderRadius:22,padding:"18px 16px",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:`0 8px 28px ${a.sh}`,position:"relative",overflow:"hidden",minHeight:100}}>
                <div style={{position:"absolute",right:-12,bottom:-12,fontSize:48,opacity:.15}}>{a.ico}</div>
                <div style={{width:42,height:42,borderRadius:13,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:12}}>{a.ico}</div>
                <p style={{fontSize:14,fontWeight:800,color:"#fff",margin:"0 0 3px",letterSpacing:"-.1px"}}>{a.label}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,.6)",margin:0,fontWeight:500}}>{a.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ══ SERVICE RATES ════════════════════════════════════════════════ */}
        <div style={{background:"#fff",borderRadius:24,padding:"18px 16px",marginBottom:20,boxShadow:"0 2px 20px rgba(0,0,0,.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <p style={{fontSize:15,fontWeight:800,color:"#0F172A",margin:0,letterSpacing:"-.2px"}}>🛠️ Service Rates</p>
            {sub?<span style={{background:"#F0FDF4",color:"#16A34A",border:"1px solid #BBF7D0",padding:"4px 12px",borderRadius:999,fontSize:11,fontWeight:700}}>⭐ 50% Off</span>
                :<span style={{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",padding:"4px 12px",borderRadius:999,fontSize:11,fontWeight:700}}>Normal Rate</span>}
          </div>
          {SVC.map((s,i)=>{
            const np=Math.round(s.norm*(ac||1));
            const sp2=Math.round(s.sub*(subAc||1));
            return(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<SVC.length-1?"1px solid #F8FAFC":"none"}}>
                <div style={{width:40,height:40,borderRadius:12,background:"#F8FAFC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,border:"1px solid #F1F5F9"}}>{s.ico}</div>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#0F172A",margin:"0 0 2px"}}>{s.n}</p>
                  <p style={{fontSize:11,color:"#94A3B8",margin:0}}>₹{s.norm}/Ac · ₹{s.sub}/Ac (Sub)</p>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  {sub&&subAc>0
                    ?<><p style={{fontSize:15,fontWeight:900,color:"#16A34A",margin:"0 0 1px"}}>₹{sp2}</p>
                       <p style={{fontSize:10,color:"#CBD5E1",margin:0,textDecoration:"line-through"}}>₹{np}</p></>
                    :<p style={{fontSize:15,fontWeight:900,color:"#0F172A",margin:0}}>₹{np}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* ══ RECENT BOOKINGS ══════════════════════════════════════════════ */}
        {confirmed.length>0&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:15,fontWeight:800,color:"#0F172A",margin:0}}>📋 Recent Bookings</p>
            <button onClick={nav.history} style={{background:"none",border:"none",color:"#16A34A",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>View All →</button>
          </div>
          {confirmed.slice(0,2).map(b=><BCard key={b.id} b={b}/>)}
        </>}

        {/* ══ SAVINGS GRID (no sub) ════════════════════════════════════════ */}
        {!sub&&ac>0&&<div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",borderRadius:24,padding:"18px 16px",marginBottom:16,border:"1px solid #FDE68A"}}>
          <p style={{fontSize:14,fontWeight:800,color:"#92400E",margin:"0 0 14px"}}>💡 आप कितना बचा सकते हैं?</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[1,2,5,10].map(a2=>(
              <div key={a2} style={{background:"#fff",borderRadius:16,padding:"13px 12px",border:"1px solid #FDE68A",textAlign:"center"}}>
                <p style={{fontSize:13,color:"#92400E",fontWeight:700,margin:"0 0 5px"}}>{a2} Acre</p>
                <p style={{fontSize:11,color:"#DC2626",margin:"0 0 2px",textDecoration:"line-through"}}>₹{(a2*N_TOT).toLocaleString("en-IN")}</p>
                <p style={{fontSize:16,fontWeight:900,color:"#16A34A",margin:"0 0 2px"}}>₹{(a2*S_TOT).toLocaleString("en-IN")}</p>
                <p style={{fontSize:10,fontWeight:700,color:"#D97706",margin:0}}>Save ₹{(a2*(N_TOT-S_TOT)).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
          <button onClick={goP} style={{width:"100%",background:"linear-gradient(135deg,#D97706,#B45309)",color:"#fff",border:"none",borderRadius:16,padding:15,cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:14,boxShadow:"0 6px 20px rgba(217,119,6,.3)"}}>
            ⭐ Subscribe करें · 50% Off पाएं
          </button>
        </div>}

      </div>
    </div>
  );
}
function Plans({user,ac,setAc,onPay,back}){
  const uid = user?.phone||"guest";
  const khets = DB.khets[uid]||[];

  // Build farm list from khets + their 7/12 entries
  const farms = khets.flatMap((k,ki)=>
    k.sat712&&k.sat712.length>0
      ? k.sat712.map((d,di)=>({
          id:`${k.id}_${di}`,
          label:`${k.name} — Farm #${di+1}`,
          village: d.village||k.village||"—",
          acres:   parseFloat(d.acres||k.acres||0),
          khetName:k.name,
          sat712:  d,
        }))
      : [{
          id:k.id,
          label:k.name,
          village:k.village||"—",
          acres:  parseFloat(k.acres||0),
          khetName:k.name,
          sat712:  null,
        }]
  );

  const [sel,setSel] = useState({}); // {farmId: true/false}
  const allSel = farms.length>0 && farms.every(f=>sel[f.id]);
  const selectedFarms = farms.filter(f=>sel[f.id]);
  const totalAc = selectedFarms.reduce((s,f)=>s+f.acres, 0);
  const amt = Math.round(totalAc*550);
  const saving = Math.round(totalAc*SAVE);

  const toggle = id => setSel(p=>({...p,[id]:!p[id]}));
  const toggleAll = () => {
    if(allSel) setSel({});
    else { const all={}; farms.forEach(f=>all[f.id]=true); setSel(all); }
  };

  const doPay = () => {
    if(selectedFarms.length===0) return;
    // pass totalAc and selected farm details
    onPay(String(totalAc), amt, selectedFarms);
  };

  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={S.hdr}><div className="hd">💰</div>
        <button style={S.bkb} onClick={back}>← Back</button>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>⭐ Subscription Plan</h1>
        <p style={{opacity:.85,fontSize:13,marginTop:3,position:"relative",zIndex:1}}>₹550/Acre/Year — Select your farms below</p>
      </div>
      <div style={{padding:"16px 15px 100px"}} className="fi">
        {/* Pricing info */}
        <div style={{...S.card,background:"linear-gradient(135deg,#1a6b38,#2d8a4e)",color:"#fff",marginBottom:14}}>
          <p style={{fontSize:13,opacity:.85}}>Normal Price (Without Sub)</p>
          <p style={{fontSize:22,fontWeight:900,color:"#ff8a65",margin:"3px 0 8px"}}>₹{N_TOT}/Acre/Visit</p>
          <p style={{fontSize:13,opacity:.85}}>🎉 Special Discount 50% Off (After Sub)</p>
          <p style={{fontSize:22,fontWeight:900,color:"#ffd54f",margin:"3px 0 8px"}}>₹{S_TOT}/Acre/Visit</p>
        </div>

        {/* Farm selection */}
        {farms.length===0?(
          <div style={{...S.card,textAlign:"center",padding:24}}>
            <p style={{fontSize:36}}>🌾</p>
            <p style={{fontWeight:700,fontSize:14,color:"#1a3d2a",marginTop:10}}>Koi farm nahi mili</p>
            <p style={{fontSize:13,color:"#9ab5a3",marginTop:6}}>Pehle Mera Khet mein farm add karein</p>
            <button onClick={back} style={{...S.btnW,marginTop:12}}>← Back to Home</button>
          </div>
        ):(
          <div style={S.card}>
            <h3 style={{fontSize:15,fontWeight:800,color:"#1a6b38",marginBottom:4}}>🌾 Apne Farms Select karein</h3>
            <p style={{fontSize:12,color:"#9ab5a3",marginBottom:14}}>Jinke liye subscription lena hai unhe tick karein</p>

            {/* Select All */}
            <button onClick={toggleAll}
              style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:14,
                border:`2px solid ${allSel?"#2d8a4e":"#d4edda"}`,
                background:allSel?"#e8f5e9":"#fff",cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>
              <div style={{width:22,height:22,borderRadius:5,border:`2px solid ${allSel?"#2d8a4e":"#aaa"}`,
                background:allSel?"#2d8a4e":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {allSel&&<span style={{color:"#fff",fontSize:14,fontWeight:900}}>✓</span>}
              </div>
              <span style={{fontWeight:800,fontSize:14,color:"#1a3d2a"}}>☑ Select All Farms</span>
              <span style={{marginLeft:"auto",fontSize:12,color:"#7a9e8a"}}>{farms.length} farms • {farms.reduce((s,f)=>s+f.acres,0)} Ac total</span>
            </button>

            {/* Individual farms */}
            {farms.map(f=>(
              <button key={f.id} onClick={()=>toggle(f.id)}
                style={{width:"100%",display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:14,
                  border:`2px solid ${sel[f.id]?"#2d8a4e":"#d4edda"}`,
                  background:sel[f.id]?"#e8f5e9":"#fff",cursor:"pointer",fontFamily:"inherit",marginBottom:8,textAlign:"left"}}>
                <div style={{width:22,height:22,borderRadius:5,border:`2px solid ${sel[f.id]?"#2d8a4e":"#bbb"}`,
                  background:sel[f.id]?"#2d8a4e":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                  {sel[f.id]&&<span style={{color:"#fff",fontSize:14,fontWeight:900}}>✓</span>}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:800,fontSize:14,color:"#1a3d2a"}}>{f.label}</p>
                  <p style={{fontSize:12,color:"#7a9e8a",marginTop:2}}>📍 Village: {f.village}</p>
                  <p style={{fontSize:12,color:"#7a9e8a"}}>🌾 Area: <b>{f.acres} Acre</b></p>
                  {f.sat712&&<p style={{fontSize:11,color:"#4a7c5a",marginTop:2}}>📜 7/12 Linked ✅</p>}
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <p style={{fontSize:14,fontWeight:900,color:sel[f.id]?"#1a6b38":"#9ab5a3"}}>₹{Math.round(f.acres*550)}</p>
                  <p style={{fontSize:10,color:"#9ab5a3"}}>per year</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Summary — only shown when farms selected */}
        {selectedFarms.length>0&&(
          <div style={{...S.card,border:"3px solid #2d8a4e",background:"#e8f5e9"}}>
            <h3 style={{fontSize:14,fontWeight:800,color:"#1a6b38",marginBottom:12}}>📋 Subscription Summary</h3>
            {selectedFarms.map(f=>(
              <div key={f.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #c8e6c9",alignItems:"center"}}>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:"#1a3d2a"}}>{f.label}</p>
                  <p style={{fontSize:11,color:"#7a9e8a"}}>📍 {f.village} • 🌾 {f.acres} Ac</p>
                </div>
                <p style={{fontSize:13,fontWeight:700,color:"#2d8a4e"}}>₹{Math.round(f.acres*550)}</p>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 4px",alignItems:"center"}}>
              <div>
                <p style={{fontSize:13,color:"#4a7c5a"}}>{selectedFarms.length} farm{selectedFarms.length>1?"s":""} • {totalAc} Acres total</p>
                <p style={{fontSize:12,color:"#4a7c5a",marginTop:2}}>Saving: ₹{saving.toLocaleString("en-IN")}/year</p>
              </div>
              <p style={{fontSize:28,fontWeight:900,color:"#1a6b38"}}>₹{amt}</p>
            </div>
            <button style={{...S.btnG,marginTop:10,padding:15,fontSize:16}}
              onClick={doPay}>
              💳 ₹{amt} — Subscribe करें ({totalAc} Acres)
            </button>
          </div>
        )}
        {selectedFarms.length===0&&farms.length>0&&(
          <p style={{textAlign:"center",fontSize:13,color:"#9ab5a3",padding:"10px 0"}}>⬆️ Koi farm select karein</p>
        )}
      </div>
    </div>
  );
}

// ═══ PAYMENT ═══════════════════════════════════════════════════════════════
function Pay({ac,amt:passedAmt,user,onSuccess,back}){
  const amt=passedAmt||Math.round(parseFloat(ac||1)*550); // use passed amt; fallback 550
  const [m,setM]=useState(null);
  const [step,ss]=useState("pick");
  const [upi,setUpi]=useState("");
  const [card,setCard]=useState({num:"",exp:"",cvv:"",name:""});
  const [err,setErr]=useState("");
  const PAYS=[{id:"pp",l:"PhonePe",ico:"💜"},{id:"gp",l:"Google Pay",ico:"🔵"},{id:"cd",l:"Card",ico:"💳"},{id:"up",l:"Other UPI",ico:"📱"}];
  const pick=mid=>{setM(mid);setErr("");ss(mid==="cd"?"card":"upi");};
  const pay=()=>{
    if(step==="upi"&&!upi.includes("@")){setErr("Valid UPI ID डालें");return;}
    if(step==="card"){if(card.num.replace(/\s/g,"").length!==16){setErr("16 digit card number");return;}if(!card.exp||!card.cvv||!card.name){setErr("सभी details भरें");return;}}
    setErr("");ss("proc");setTimeout(()=>{ss("done");setTimeout(()=>onSuccess(ac,amt),1200);},2000);
  };
  const pm=PAYS.find(x=>x.id===m);
  if(step==="proc")return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#f0faf0",textAlign:"center",padding:20}}>
    <div style={{fontSize:60,marginBottom:14,display:"inline-block",animation:"sp 1s linear infinite"}}>🔄</div>
    <h2 style={{fontSize:20,fontWeight:900,color:"#1a6b38",marginBottom:6}}>Payment Processing...</h2>
    <div style={{marginTop:16,background:"#d4edda",borderRadius:999,height:9,width:240,overflow:"hidden"}}>
      <div style={{height:"100%",background:"linear-gradient(90deg,#2d8a4e,#66bb6a)",borderRadius:999,animation:"pw 2s linear forwards"}}/>
    </div>
  </div>);
  if(step==="done")return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(170deg,#e8f5e9,#f0faf0)",textAlign:"center",padding:20}}>
    <div style={{fontSize:76,animation:"pop .5s cubic-bezier(.16,1,.3,1)",marginBottom:12}}>✅</div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#1a6b38",marginBottom:6}}>Payment Successful!</h1>
    <p style={{fontSize:15,color:"#4a7c5a"}}>₹{amt} paid • {ac} Acre 50% Off Unlock! 🎉</p>
  </div>);
  return(<div style={{background:"#F8FAFC",minHeight:"100vh"}}>
    <div style={{...S.hdr,background:"linear-gradient(135deg,#1a237e,#283593)"}}>
      <div className="hd">💳</div>
      <button style={S.bkb} onClick={back}>← Back</button>
      <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>💳 Payment — ₹{amt}</h1>
      <p style={{opacity:.8,fontSize:13,marginTop:3,position:"relative",zIndex:1}}>{ac} Acre Subscription</p>
    </div>
    <div style={{padding:"16px 15px 100px"}} className="fi">
      <div style={S.card}>
        {[["Plan",`${ac} Acre / 1 Year`],["Unlocks",`${ac} Acre 50% Off`],["Total",`₹${amt}`]].map(([k,v],i,ar)=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<ar.length-1?"1px solid #e8f5e9":"none"}}>
            <span style={{fontSize:13,color:"#4a7c5a"}}>{k}</span>
            <span style={{fontSize:i===ar.length-1?18:13,fontWeight:i===ar.length-1?900:700,color:i===ar.length-1?"#1a6b38":"#1a3d2a"}}>{v}</span>
          </div>
        ))}
      </div>
      {step==="pick"&&<div style={S.card}>
        <h3 style={{fontSize:15,fontWeight:800,color:"#14532D",marginBottom:14,letterSpacing:"-.2px"}}>💳 Payment Method</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          {PAYS.map(p=>(
            <button key={p.id} onClick={()=>pick(p.id)} style={{padding:"14px 10px",borderRadius:12,border:`2px solid ${m===p.id?"#2d8a4e":"#d4edda"}`,background:m===p.id?"#e8f5e9":"#fff",cursor:"pointer",textAlign:"center",fontFamily:"inherit"}}>
              <div style={{fontSize:26,marginBottom:4}}>{p.ico}</div>
              <p style={{fontSize:13,fontWeight:800,color:"#1a3d2a"}}>{p.l}</p>
            </button>
          ))}
        </div>
      </div>}
      {step==="upi"&&<div style={S.card}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
          <div style={{width:42,height:42,borderRadius:10,background:"#e8f5e9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{pm?.ico}</div>
          <div><h3 style={{fontSize:15,fontWeight:800}}>{pm?.l}</h3><p style={{fontSize:12,color:"#7a9e8a"}}>₹{amt} pay करें</p></div>
        </div>
        <div style={{background:"#f5f5f5",borderRadius:14,padding:14,textAlign:"center",marginBottom:12,border:"2px solid #e0e0e0"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:2,width:108,margin:"0 auto 8px"}}>
            {Array.from({length:81},(_,i)=><div key={i} style={{width:"100%",aspectRatio:"1",background:(i*13+i*7)%4===0||i<10||i>=90||i%10===0||i%10===9?"#1a3d2a":"#fff",borderRadius:1}}/>)}
          </div>
          <p style={{fontSize:12,color:"#555",fontWeight:600}}>📷 QR Scan — ₹{amt}</p>
        </div>
        <label style={S.lbl}>📱 UPI ID</label>
        <input style={{...S.inp,marginBottom:5}} placeholder="name@ybl / number@paytm" value={upi} onChange={e=>{setUpi(e.target.value);setErr("");}}/>
        {err&&<p style={{color:"#EF4444",fontSize:13,marginBottom:8}}>⚠️ {err}</p>}
        <button style={S.btnG} onClick={pay}>{pm?.ico} ₹{amt} Pay करें</button>
        <button style={S.btnW} onClick={()=>ss("pick")}>← Method बदलें</button>
      </div>}
      {step==="card"&&<div style={S.card}>
        <div style={{background:"linear-gradient(135deg,#1a237e,#283593)",borderRadius:12,padding:"14px 15px 11px",marginBottom:12,color:"#fff"}}>
          <p style={{fontSize:11,opacity:.7,marginBottom:10}}>DEBIT / CREDIT CARD</p>
          <p style={{fontSize:15,fontWeight:700,letterSpacing:2.5,marginBottom:10}}>{card.num?card.num.replace(/\s/g,"").replace(/(.{4})/g,"$1 ").trim():"XXXX XXXX XXXX XXXX"}</p>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <p style={{fontSize:12}}>{card.name||"CARD HOLDER"}</p><p style={{fontSize:12}}>{card.exp||"MM/YY"}</p>
          </div>
        </div>
        <label style={S.lbl}>💳 Card Number</label>
        <input style={{...S.inp,marginBottom:10}} placeholder="1234 5678 9012 3456" inputMode="numeric" maxLength={19} value={card.num}
          onChange={e=>{const v=e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();setCard(c=>({...c,num:v}));setErr("");}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div><label style={S.lbl}>📅 Expiry</label>
            <input style={S.inp} placeholder="MM/YY" maxLength={5} value={card.exp}
              onChange={e=>{let v=e.target.value.replace(/\D/g,"");if(v.length>=2)v=v.slice(0,2)+"/"+v.slice(2,4);setCard(c=>({...c,exp:v}));setErr("");}}/>
          </div>
          <div><label style={S.lbl}>🔒 CVV</label>
            <input style={S.inp} placeholder="123" maxLength={3} type="password" inputMode="numeric" value={card.cvv}
              onChange={e=>{setCard(c=>({...c,cvv:e.target.value.replace(/\D/g,"").slice(0,3)}));setErr("");}}/>
          </div>
        </div>
        <label style={S.lbl}>👤 Name on Card</label>
        <input style={{...S.inp,marginBottom:5}} placeholder="As printed on card" value={card.name} onChange={e=>{setCard(c=>({...c,name:e.target.value.toUpperCase()}));setErr("");}}/>
        {err&&<p style={{color:"#EF4444",fontSize:13,marginTop:8}}>⚠️ {err}</p>}
        <button style={{...S.btnG,marginTop:12}} onClick={pay}>🔒 ₹{amt} Pay करें</button>
        <button style={S.btnW} onClick={()=>ss("pick")}>← Method बदलें</button>
      </div>}
    </div>
  </div>);
}

// ═══ BOOK ══════════════════════════════════════════════════════════════════
function Book({user,selKhet,setSelKhet,onNext,back}){
  // FLOW: Service+Acres → Payment Summary → [Pay Now Demo] → Date+Note → Confirm
  const [sel,setSel]       = useState(null);
  const [acStr,setAcStr]   = useState("");
  const [paid,setPaid]     = useState(false);   // payment_status = "paid" only after demo pay
  const [date,setDate]     = useState("");
  const [note,setNote]     = useState("");
  const [err,setErr]       = useState("");
  const [paying,setPaying] = useState(false);   // processing animation
  const [step,setStep]     = useState("book");  // "book" | "date" — date shown only after payment

  const subAc  = parseFloat(user?.sA||0);
  // Always use selected farm's exact acres — never default to user?.acres
  const selDocAcres = selKhet?.selected712?.acres || selKhet?.khetAcres || null;
  const ac     = selDocAcres
    ? parseFloat(selDocAcres)
    : (parseFloat(acStr)||1);
  const isDisc = user?.sub && subAc>=ac;
  const sp     = s => Math.round(s.sub*ac);
  const np     = s => Math.round(s.norm*ac);
  const amt    = sel ? (isDisc?sp(sel):np(sel)) : 0;
  const min    = new Date(); min.setDate(min.getDate()+1);

  // ── DEMO PAY (replace this block with Razorpay later) ─────────────────
  const doPay = () => {
    if(!sel){ setErr("Service पहले चुनें"); return; }
    setPaying(true); setErr("");
    setTimeout(() => {
      setPaying(false);
      setPaid(true);             // payment_status = "paid"
      setStep("date");           // NOW show date+note
    }, 1800);
  };

  // ── Final confirm — only reachable after paid===true ──────────────────
  const doConfirm = () => {
    if(!paid){ setErr("Please complete payment to continue."); return; }
    if(!date){ setErr("Date चुनें"); return; }
    setErr("");
    onNext({
      serviceId:sel.id, serviceNameHi:sel.n, icon:sel.ico,
      amount:amt, normalAmt:np(sel), discAmt:sp(sel),
      date, note, discApplied:isDisc, acres:ac,
      payment_status:"paid",
      khetName:     selKhet?.name||null,
      khetVillage:  selKhet?.selected712?.village || selKhet?.village || null,
      khetAddress:  selKhet?.address||null,
      khetAcres:    selKhet?.selected712?.acres || selKhet?.acres || null,
      sat712Label:  selKhet?.selected712Label||null,
      sat712:       selKhet?.selected712||null,
    });
  };

  // ══ SCREEN: Date + Note (only shown after payment) ════════════════════
  if(step==="date") return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={S.hdr}><div className="hd">📅</div>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>📅 Date & Details</h1>
        <p style={{opacity:.85,fontSize:13,marginTop:4,position:"relative",zIndex:1}}>✅ Payment Done — अब Date चुनें</p>
      </div>
      <div style={{padding:"16px 15px 100px"}} className="fi">
        {/* Payment success badge */}
        <div style={{background:"linear-gradient(135deg,#1b5e20,#2e7d32)",borderRadius:14,padding:"12px 16px",marginBottom:12,color:"#fff",display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:28}}>✅</span>
          <div>
            <p style={{fontWeight:800,fontSize:14}}>Payment Successful! (Demo)</p>
            <p style={{fontSize:12,opacity:.85}}>{sel?.ico} {sel?.n} • {ac} Ac • ₹{amt}</p>
          </div>
        </div>
        <div style={S.card}>
          <label style={S.lbl}>📅 Date चुनें (जरूरी)</label>
          <input style={{...S.inp,marginBottom:16}} type="date"
            min={min.toISOString().split("T")[0]} value={date}
            onChange={e=>{setDate(e.target.value);setErr("");}}/>
          <label style={S.lbl}>📝 Customer Message / खेत का पता (Optional)</label>
          <textarea style={{...S.inp,resize:"none"}} rows={3}
            placeholder="खेत का पता, निर्देश, landmark..." value={note}
            onChange={e=>setNote(e.target.value)}/>
        </div>
        {err&&<p style={{color:"#EF4444",fontSize:13,marginBottom:10,fontWeight:700}}>⚠️ {err}</p>}
        <button style={{...S.btnG,padding:15,fontSize:16}} onClick={doConfirm}>
          ✅ Booking Confirm करें →
        </button>
      </div>
    </div>
  );

  // ══ SCREEN: Service + Acres + Payment Summary ════════════════════════
  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={S.hdr}><div className="hd">🚜</div>
        <button style={S.bkb} onClick={back}>← Back</button>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>🛠️ Service & Payment</h1>
        {/* Progress indicator */}
        <div style={{display:"flex",gap:5,marginTop:10,position:"relative",zIndex:1}}>
          {[["1 Service","active"],["2 Payment","active"],["3 Date","locked"],["4 Confirm","locked"]].map(([l,s])=>(
            <div key={l} style={{flex:1,background:s==="active"?"#ffd54f":"rgba(255,255,255,.2)",borderRadius:6,padding:"3px 4px",textAlign:"center"}}>
              <p style={{fontSize:9,fontWeight:800,color:s==="active"?"#5d3b00":"rgba(255,255,255,.7)"}}>{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 15px 100px"}} className="fi">

        {/* Khet Selector */}
        {selKhet
          ?<div style={{background:"linear-gradient(135deg,#1b5e20,#2e7d32)",borderRadius:14,padding:"14px 16px",marginBottom:12,color:"#fff"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:26}}>🌾</span>
              <div style={{flex:1}}>
                <p style={{fontSize:11,opacity:.8,marginBottom:2}}>✅ Selected Farm</p>
                <p style={{fontWeight:900,fontSize:15}}>{selKhet.name}</p>
                <p style={{fontSize:13,fontWeight:700,marginTop:3}}>
                  📍 Village: {selKhet.selected712?.village || selKhet.village || "—"}
                </p>
                <p style={{fontSize:13,fontWeight:700,marginTop:2}}>
                  🌾 Area: {selKhet.selected712?.acres || selKhet.acres} Acre
                </p>
                {selKhet.selected712Label&&(
                  <div style={{background:"rgba(255,255,255,.15)",borderRadius:8,padding:"6px 10px",marginTop:8}}>
                    <p style={{fontSize:12,fontWeight:700}}>📜 {selKhet.selected712Label}</p>
                  </div>
                )}
              </div>
              <button onClick={()=>setSelKhet&&setSelKhet(null)} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:8,padding:"5px 9px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:11,flexShrink:0}}>✕ Change</button>
            </div>
          </div>
          :<div style={{...S.card,border:"2px dashed #2d8a4e",padding:14,marginBottom:12}}>
            <p style={{fontSize:13,color:"#4a7c5a",fontWeight:700,marginBottom:10,textAlign:"center"}}>🌾 Apna Khet / Farm Select karein (Optional)</p>
            {/* Show all saved khets inline so customer can see and pick */}
            {(()=>{
              const uid=user?.phone||"guest";
              const myKhets=DB.khets[uid]||[];
              if(myKhets.length===0) return(
                <div style={{textAlign:"center"}}>
                  <p style={{fontSize:12,color:"#9ab5a3",marginBottom:8}}>Koi saved farm nahi hai</p>
                  <button onClick={()=>nav&&nav.khet&&nav.khet()} style={{background:"#e8f5e9",color:"#1a6b38",border:"1.5px solid #2d8a4e",borderRadius:12,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:13}}>🌾 Add New Khet →</button>
                </div>
              );
              return(<>
                {myKhets.map((k,ki)=>(
                  <div key={k.id||ki} style={{border:"1.5px solid #d4edda",borderRadius:12,marginBottom:8,overflow:"hidden"}}>
                    <div style={{background:"#f0faf0",padding:"10px 12px",borderBottom:"1px solid #d4edda"}}>
                      <p style={{fontWeight:800,fontSize:14,color:"#1a3d2a"}}>{k.name}</p>
                      <p style={{fontSize:12,color:"#7a9e8a"}}>🏘️ {k.village||"—"} • 🌾 {k.acres} Acre</p>
                      {k.address&&<p style={{fontSize:12,color:"#7a9e8a"}}>📍 {k.address}</p>}
                    </div>
                    {k.sat712&&k.sat712.length>0?(
                      <div style={{padding:"8px 12px"}}>
                        <p style={{fontSize:11,color:"#4a7c5a",fontWeight:700,marginBottom:6}}>📜 Farms — tap to select:</p>
                        {k.sat712.map((d,di)=>(
                          <button key={d.id||di}
                            onClick={()=>setSelKhet&&setSelKhet({
                              ...k,
                              selected712:d,
                              selected712Label:d.label,
                              khetVillage: d.village||k.village,
                              khetAcres:   d.acres||k.acres,
                            })}
                            style={{width:"100%",textAlign:"left",background:"#e8f5e9",border:"1.5px solid #a5d6a7",borderRadius:8,padding:"10px 12px",marginBottom:6,cursor:"pointer",fontFamily:"inherit"}}>
                            <p style={{fontSize:13,fontWeight:800,color:"#1a6b38",marginBottom:3}}>🌾 Farm #{di+1} — 7/12 Attached ✅</p>
                            <p style={{fontSize:12,color:"#4a7c5a"}}>📍 Village: <b>{d.village||k.village||"—"}</b></p>
                            <p style={{fontSize:12,color:"#4a7c5a"}}>🌾 Area: <b>{d.acres||k.acres} Acre</b></p>
                            <p style={{fontSize:11,color:"#7a9e8a",marginTop:2}}>📎 {d.src} • {d.uploadedAt?new Date(d.uploadedAt).toLocaleDateString("en-IN"):""}</p>
                            <span style={{fontSize:11,color:"#2d8a4e",fontWeight:800}}>Tap to Select →</span>
                          </button>
                        ))}
                      </div>
                    ):(
                      <div style={{padding:"8px 12px"}}>
                        <button onClick={()=>setSelKhet&&setSelKhet({...k})}
                          style={{width:"100%",background:"#2d8a4e",color:"#fff",border:"none",borderRadius:8,padding:"8px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:12}}>
                          ✅ Select This Farm
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={()=>nav&&nav.khet&&nav.khet()} style={{width:"100%",background:"none",color:"#2d8a4e",border:"1.5px dashed #2d8a4e",borderRadius:12,padding:"8px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:12,marginTop:4}}>
                  ➕ Add New Khet →
                </button>
              </>);
            })()}
          </div>
        }

        {/* Acres selector */}
        <div style={S.card}>
          <label style={S.lbl}>🌾 Total Acres enter करें</label>
          <input style={{...S.inp,fontSize:22,fontWeight:800,textAlign:"center",marginBottom:8}}
            type="number" min=".5" step=".5" placeholder="0"
            value={acStr} onChange={e=>setAcStr(e.target.value)}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["0.5","1","2","3","5","8","10"].map(n=>(
              <button key={n} onClick={()=>setAcStr(n)}
                style={{padding:"6px 12px",borderRadius:8,border:`2px solid ${acStr===n?"#2d8a4e":"#d4edda"}`,
                  background:acStr===n?"#2d8a4e":"#fff",color:acStr===n?"#fff":"#1a3d2a",
                  fontWeight:800,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
                {n}Ac
              </button>
            ))}
          </div>
        </div>

        {/* Service list */}
        <div style={S.card}>
          <h3 style={{fontSize:15,fontWeight:800,color:"#1a6b38",marginBottom:4}}>🛠️ Service चुनें</h3>
          <p style={{fontSize:12,color:"#9ab5a3",marginBottom:10}}>Rate/Acre × {ac} Acre = Total</p>
          {SVC.map(s=>(
            <div key={s.id} className={`sv${sel?.id===s.id?" on":""}`}
              onClick={()=>{setSel(s);setErr("");setPaid(false);}}>
              <span style={{fontSize:22}}>{s.ico}</span>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:14,color:"#1a3d2a"}}>{s.n}</p>
                <p style={{fontSize:11,color:"#7a9e8a",marginTop:1}}>₹{s.norm}/Ac (Normal) • ₹{s.sub}/Ac (50%Off)</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <span style={{background:isDisc?"#1a6b38":"#555",color:"#fff",padding:"3px 9px",borderRadius:999,fontSize:13,fontWeight:800,display:"block"}}>
                  {isDisc?`₹${sp(s)} 🎉`:`₹${np(s)}`}
                </span>
                <span style={{fontSize:10,color:"#7a9e8a",marginTop:2,display:"block"}}>{ac}Ac</span>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Summary — shown only when service selected */}
        {sel&&<div style={{...S.card,border:"2px solid #1a237e",background:"#f3f4ff"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#1a237e",marginBottom:12}}>💳 Payment Summary</h3>
          {[
            ["🛠️ Service",    `${sel.ico} ${sel.n}`],
            ["🌾 Total Acres", `${ac} Acre`],
            ["💰 Rate",        `₹${isDisc?sel.sub:sel.norm}/Acre`],
            ["💵 Total Amount",`₹${amt}`],
          ].map(([k,v],i,ar)=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",
              padding:"9px 0",borderBottom:i<ar.length-1?"1px solid #e0e0e0":"none",alignItems:"center"}}>
              <span style={{fontSize:13,color:"#555"}}>{k}</span>
              <span style={{fontSize:i===ar.length-1?22:13,fontWeight:i===ar.length-1?900:700,
                color:i===ar.length-1?"#1a6b38":"#1a3d2a"}}>{v}</span>
            </div>
          ))}
          {paid&&<div style={{background:"#e8f5e9",borderRadius:12,padding:"8px 12px",marginTop:10}}>
            <p style={{fontWeight:800,color:"#1a6b38",fontSize:13}}>✅ Payment Done • payment_status = "paid"</p>
          </div>}
        </div>}

        {/* ── DEMO PAY BUTTON ── */}
        {sel&&!paid&&(
          <button
            onClick={doPay}
            disabled={paying}
            style={{...S.btnG,marginBottom:10,padding:16,fontSize:16,
              background:paying?"#999":"linear-gradient(135deg,#1a237e,#283593)",
              display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            {paying
              ? <><span style={{display:"inline-block",animation:"sp 1s linear infinite"}}>🔄</span> Processing...</>
              : <><span>💳</span> Pay Now (Demo) — ₹{amt}</>}
          </button>
        )}
        {sel&&paid&&(
          <div style={{background:"#e8f5e9",borderRadius:12,padding:"12px 16px",marginBottom:10,border:"2px solid #4caf50",display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:24}}>✅</span>
            <div><p style={{fontWeight:800,color:"#1a6b38",fontSize:14}}>₹{amt} Payment Successful!</p>
              <p style={{fontSize:12,color:"#4a7c5a"}}>Continue दबाकर Date select करें</p></div>
          </div>
        )}

        {err&&<p style={{color:"#EF4444",fontSize:13,marginBottom:8,fontWeight:700}}>⚠️ {err}</p>}

        {/* CONTINUE BUTTON — always visible, disabled until paid */}
        <button
          onClick={paid ? ()=>setStep("date") : ()=>setErr("Please complete payment to continue.")}
          style={{
            ...S.btnG,
            padding:14,fontSize:15,
            background:paid?"linear-gradient(135deg,#2d8a4e,#1a6b38)":"#ccc",
            cursor:paid?"pointer":"not-allowed",
            opacity:paid?1:0.7,
          }}>
          {paid ? "Continue → Select Date" : "🔒 Continue (Complete Payment First)"}
        </button>

        {!paid&&<div style={{background:"#fff8e1",borderRadius:10,padding:"10px 14px",marginTop:8,border:"1.5px solid #ffe082"}}>
          <p style={{fontSize:12,color:"#e65100",fontWeight:700}}>
            ⚠️ Payment complete होने के बाद ही Continue button work करेगा।<br/>
            Booking तब तक create नहीं होगी।
          </p>
        </div>}

        <div style={{textAlign:"center",padding:"12px 0",color:"#9ab5a3"}}>
          <p style={{fontSize:11}}>🔒 Demo Mode • Razorpay integration coming soon</p>
        </div>
      </div>
    </div>
  );
}

function Confirm({dft,onOk,back}){
  const [busy,setBusy]=useState(false);
  return(<div style={{background:"#F8FAFC",minHeight:"100vh"}}>
    <div style={S.hdr}><div className="hd">🚜</div>
      <button style={S.bkb} onClick={back}>← Edit</button>
      <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>✅ Confirm Booking</h1>
    </div>
    <div style={{padding:"16px 15px 100px"}} className="fi">
      <div style={S.card}>
        {[["Service",`${dft?.icon} ${dft?.serviceNameHi}`],["Date",fd(dft?.date)],["Normal Price",`₹${dft?.normalAmt}`],dft?.discApplied&&["🎉 50% Off",`₹${dft?.discAmt}`],["आप Pay करेंगे",`₹${dft?.amount}`],dft?.note&&["Note",dft.note]].filter(Boolean).map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #e8f5e9"}}>
            <span style={{color:"#7a9e8a",fontWeight:600,fontSize:13}}>{k}</span>
            <span style={{color:k==="Normal Price"?"#c62828":k.includes("50%")?"#1a6b38":k==="आप Pay करेंगे"?"#1a6b38":"#1a3d2a",fontWeight:700,fontSize:13}}>{v}</span>
          </div>
        ))}
      </div>
      <button style={S.btnG} disabled={busy} onClick={()=>{setBusy(true);setTimeout(()=>onOk(dft),700);}}>{busy?"⏳...":"🎉 Booking Confirm करें"}</button>
      <button style={S.btnW} onClick={back}>✏️ Edit</button>
    </div>
  </div>);
}

function OK({dft,nav}){return(
  <div style={{background:"linear-gradient(170deg,#e8f5e9,#f0faf0)",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"22px 18px",textAlign:"center"}}>
    <div className="fi" style={{maxWidth:400,width:"100%"}}>
      <div style={{fontSize:76,animation:"pop .5s cubic-bezier(.16,1,.3,1)",marginBottom:11}}>✅</div>
      <h1 style={{fontSize:24,fontWeight:900,color:"#1a6b38",marginBottom:5}}>Booking Confirmed!</h1>
      <p style={{fontSize:15,color:"#4a7c5a",marginBottom:18}}>🎉 Tractor आएगा आपके खेत पर!</p>
      <div style={{...S.card,marginBottom:18,textAlign:"left"}}>
        <div style={{textAlign:"center",marginBottom:11}}>
          <span style={{fontSize:34}}>{dft?.icon}</span>
          <h3 style={{fontSize:15,fontWeight:900,color:"#1a3d2a",marginTop:5}}>{dft?.serviceNameHi}</h3>
        </div>
        {[["📅 Date",fd(dft?.date)],["💰 Amount",`₹${dft?.amount}${dft?.discApplied?" (50% Off)":""}`],["🆔 ID",dft?.id]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #e8f5e9"}}>
            <span style={{color:"#7a9e8a",fontSize:13,fontWeight:600}}>{k}</span>
            <span style={{color:"#1a3d2a",fontSize:13,fontWeight:700}}>{v}</span>
          </div>
        ))}
        <div style={{background:"#e8f5e9",borderRadius:8,padding:"8px 12px",marginTop:11}}>
          <p style={{color:"#1a6b38",fontWeight:700,fontSize:13}}>✅ Confirmed • Status: Pending Driver</p>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        <button style={{...S.btnW,marginTop:0}} onClick={nav.history}>📋 Bookings</button>
        <button style={S.btnG} onClick={nav.home}>🏠 Home</button>
      </div>
    </div>
  </div>
);}

function History({bks,nav,tryBook,openChat}){return(
  <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
    <div style={S.hdr}><div className="hd">🚜</div>
      <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>📋 My Bookings</h1>
    </div>
    <div style={{padding:"16px 15px",paddingBottom:100}} className="fi">
      {bks.length===0?<div style={{textAlign:"center",padding:"52px 18px"}}>
        <div style={{fontSize:60}}>📋</div>
        <h3 style={{fontSize:18,fontWeight:700,color:"#4a7c5a",marginTop:11}}>कोई Booking नहीं</h3>
        <button style={{...S.btnG,marginTop:12,maxWidth:220}} onClick={tryBook}>🚜 Book करें</button>
      </div>:bks.map(b=><BCard key={b.id} b={b} full onChat={()=>openChat(b)}/>)}
    </div>
    <BNav active="history" nav={nav}/>
  </div>
);}

// ═══ CHAT ══════════════════════════════════════════════════════════════════
function Chat({booking,user,role,back}){
  const [msgs,setMsgs]=useState(DB.chats[booking?.id]||[]);
  const [txt,setTxt]=useState("");
  const send=()=>{
    if(!txt.trim())return;
    const m={id:gid(),from:role,name:user?.name||"User",text:txt,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})};
    const updated=[...msgs,m];
    DB.chats[booking?.id]=updated;
    setMsgs(updated);setTxt("");
  };
  return(
    <div style={{background:"#f0faf0",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{...S.hdr,background:"linear-gradient(135deg,#1565c0,#0d47a1)",paddingBottom:16}}>
        <button style={S.bkb} onClick={back}>← Back</button>
        <h1 style={{fontSize:18,fontWeight:900,position:"relative",zIndex:1}}>💬 Chat — Booking #{booking?.id}</h1>
        <p style={{opacity:.8,fontSize:13,marginTop:3,position:"relative",zIndex:1}}>{booking?.serviceNameHi} • {fd(booking?.date)}</p>
      </div>
      {/* Call buttons */}
      <div style={{padding:"12px 15px",background:"#fff",borderBottom:"1px solid #e0e0e0",display:"flex",gap:10}}>
        <button style={{flex:1,background:"#4caf50",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>📞 {role==="driver"?"Call Customer":"Call Driver"}</button>
        <button style={{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>💬 WhatsApp</button>
      </div>
      {/* Messages */}
      <div style={{flex:1,padding:"12px 15px",overflowY:"auto",display:"flex",flexDirection:"column",gap:8,minHeight:300}}>
        {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#9ab5a3"}}>
          <p style={{fontSize:32}}>💬</p>
          <p style={{fontSize:14,marginTop:8}}>Chat शुरू करें</p>
        </div>}
        {msgs.map(m=>(
          <div key={m.id} style={{display:"flex",justifyContent:m.from===role?"flex-end":"flex-start"}}>
            <div style={{background:m.from===role?"#2d8a4e":"#fff",color:m.from===role?"#fff":"#1a3d2a",padding:"9px 13px",borderRadius:m.from===role?"16px 16px 4px 16px":"16px 16px 16px 4px",maxWidth:"75%",boxShadow:"0 1px 4px rgba(0,0,0,.1)"}}>
              <p style={{fontSize:11,opacity:.75,marginBottom:3,fontWeight:600}}>{m.name}</p>
              <p style={{fontSize:14,lineHeight:1.4}}>{m.text}</p>
              <p style={{fontSize:10,opacity:.65,marginTop:4,textAlign:"right"}}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <div style={{padding:"12px 15px",background:"#fff",borderTop:"1px solid #e0e0e0",display:"flex",gap:10,alignItems:"center"}}>
        <input style={{...S.inp,flex:1,padding:"11px 14px",marginBottom:0}} placeholder="Message लिखें..." value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
        <button onClick={send} style={{background:"#2d8a4e",color:"#fff",border:"none",borderRadius:10,padding:"11px 16px",cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:16}}>Send</button>
      </div>
    </div>
  );
}

// ═══ DRIVER LOGIN ══════════════════════════════════════════════════════════
function DriverLogin({onLogin,back}){
  const [step,ss]=useState("ph");
  const [ph,setPh]=useState("");
  const [otp,setOtp]=useState(["","","","","",""]);
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState("");
  const refs=useRef([]);
  const send=()=>{if(ph.length!==10){setErr("10 digit number");return;}setBusy(true);setErr("");setTimeout(()=>{setBusy(false);ss("otp");setOtp(["1","2","3","4","5","6"]);},900);};
  const verify=()=>{if(otp.join("")!=="123456"){setErr("गलत OTP");return;}setBusy(true);setTimeout(()=>{setBusy(false);onLogin(ph);},500);};
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"24px 18px",background:"linear-gradient(170deg,#e3f2fd,#f0f8ff 60%,#fff)"}}>
      <div className="fi" style={{maxWidth:400,margin:"0 auto",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:52}}>🚜</div>
          <h1 style={{fontSize:22,fontWeight:900,color:"#1565c0",margin:"7px 0 3px"}}>Driver Login</h1>
          <p style={{color:"#4a7c5a",fontSize:13}}>Tractor Owner / Driver Portal</p>
        </div>
        <div style={S.card}>
          {step==="ph"?(<>
            <label style={S.lbl}>📱 Mobile Number</label>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <div style={{background:"#e3f2fd",borderRadius:14,padding:13,fontWeight:800,color:"#1565c0",border:"2px solid #bbdefb"}}>+91</div>
              <input style={{...S.inp,flex:1,border:"2px solid #bbdefb"}} placeholder="10-digit number" inputMode="numeric" value={ph} onChange={e=>setPh(e.target.value.replace(/\D/g,"").slice(0,10))}/>
            </div>
            {err&&<p style={{color:"#EF4444",fontSize:13,marginBottom:8}}>⚠️ {err}</p>}
            <button style={S.btnR} onClick={send} disabled={busy}>{busy?"📤 भेज रहे हैं...":"📨 OTP भेजें"}</button>
            <p style={{textAlign:"center",fontSize:12,color:"#9ab5a3",marginTop:8}}>Demo OTP: <b>123456</b></p>
          </>):(<>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
              <button onClick={()=>ss("ph")} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#1565c0"}}>←</button>
              <div><h2 style={{fontSize:17,fontWeight:800}}>OTP Verify</h2><p style={{color:"#7a9e8a",fontSize:12}}>+91 {ph}</p></div>
            </div>
            <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:14}}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>refs.current[i]=el}
                  style={{width:43,height:52,border:`2px solid ${d?"#1565c0":"#bbdefb"}`,borderRadius:10,textAlign:"center",fontSize:21,fontWeight:800,color:"#1a3d2a",background:"#fafffe",outline:"none"}}
                  maxLength={1} value={d} inputMode="numeric"
                  onChange={e=>{if(!/^\d?$/.test(e.target.value))return;const n=[...otp];n[i]=e.target.value;setOtp(n);if(e.target.value&&i<5)refs.current[i+1]?.focus();}}
                  onKeyDown={e=>e.key==="Backspace"&&!d&&i>0&&refs.current[i-1]?.focus()}/>
              ))}
            </div>
            {err&&<p style={{color:"#EF4444",fontSize:13,marginBottom:8}}>⚠️ {err}</p>}
            <button style={S.btnR} onClick={verify} disabled={busy}>{busy?"⏳...":"✅ Verify & Login"}</button>
          </>)}
          <button style={{...S.btnW,borderColor:"#bbdefb",color:"#1565c0",marginTop:9}} onClick={back}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// ═══ DRIVER REGISTRATION ══════════════════════════════════════════════════
function DriverReg({phone,onDone,back}){
  const [name,setName]=useState(""); const [mob,setMob]=useState(phone||""); const [vil,setVil]=useState("");
  const [tnum,setTnum]=useState(""); const [tdet,setTdet]=useState(""); const [aad,setAad]=useState(null); const [lic,setLic]=useState(null);
  const [errs,setErrs]=useState({}); const [busy,setBusy]=useState(false);
  const clr=k=>setErrs(p=>({...p,[k]:""}));
  const submit=()=>{
    const e={};
    if(!name.trim())e.name="जरूरी"; if(mob.length!==10)e.mob="10 digit"; if(!vil.trim())e.vil="जरूरी";
    if(!tnum.trim())e.tnum="जरूरी"; if(!aad)e.aad="Upload करें"; if(!lic)e.lic="Upload करें";
    if(Object.keys(e).length){setErrs(e);return;}
    setBusy(true);
    setTimeout(()=>{setBusy(false);onDone({name,phone:mob,village:vil,tractorNum:tnum,tractorDet:tdet,aadDone:true,licDone:true,approved:true,earnings:0,bookingsCount:0});},1500);
  };
  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={{...S.hdr,background:"linear-gradient(135deg,#1565c0,#0d47a1)"}}><div className="hd">🚜</div>
        <button style={S.bkb} onClick={back}>← Back</button>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>🚜 Driver Registration</h1>
      </div>
      <div style={{padding:"16px 15px 100px"}} className="fi">
        <div style={S.card}>
          <h3 style={{fontSize:15,fontWeight:800,color:"#1E40AF",marginBottom:14,letterSpacing:"-.2px"}}>👤 Personal Details</h3>
          <FF label="पूरा नाम" ico="👤" val={name} onChange={e=>{setName(e.target.value);clr("name");}} err={errs.name}/>
          <FF label="Mobile" ico="📱" type="tel" val={mob} onChange={e=>{setMob(e.target.value.replace(/\D/g,"").slice(0,10));clr("mob");}} err={errs.mob}/>
          <FF label="गाव / Village" ico="🏘️" val={vil} onChange={e=>{setVil(e.target.value);clr("vil");}} err={errs.vil}/>
          <FF label="Tractor Number" ico="🚜" val={tnum} onChange={e=>{setTnum(e.target.value.toUpperCase());clr("tnum");}} err={errs.tnum}/>
          <FF label="Tractor Details (Brand, Model)" ico="⚙️" val={tdet} onChange={e=>setTdet(e.target.value)}/>
        </div>
        <div style={S.card}>
          <h3 style={{fontSize:15,fontWeight:800,color:"#1E40AF",marginBottom:14,letterSpacing:"-.2px"}}>📄 Documents</h3>
          <Upload label="Aadhaar Card" ico="🪪" val={aad} err={errs.aad} onPick={t=>{setAad(t);clr("aad");}} onRm={()=>setAad(null)} preview={aad&&<AadCard name={name}/>}/>
          <Upload label="Driving License" ico="🪪" val={lic} err={errs.lic} onPick={t=>{setLic(t);clr("lic");}} onRm={()=>setLic(null)} preview={lic&&<div style={{background:"#e3f2fd",borderRadius:14,padding:"12px",border:"2px solid #90caf9",marginBottom:4,textAlign:"center"}}><p style={{fontSize:14,fontWeight:800,color:"#1565c0"}}>🪪 Driving License Uploaded ✅</p></div>}/>
        </div>
        {busy&&<div style={{background:"#e3f2fd",borderRadius:12,padding:14,marginBottom:12,textAlign:"center",border:"2px solid #90caf9"}}>
          <div style={{fontSize:26,marginBottom:7,display:"inline-block",animation:"sp 1s linear infinite"}}>🔄</div>
          <p style={{fontWeight:700,color:"#1565c0"}}>Registering...</p>
        </div>}
        <button style={S.btnR} onClick={submit} disabled={busy}>{busy?"⏳...":"✅ Driver Registration करें"}</button>
      </div>
    </div>
  );
}

// ═══ DRIVER HOME ═══════════════════════════════════════════════════════════

// ═══ DRIVER HOME DASHBOARD ════════════════════════════════════════════════════
function DriverHome({driver,dnav,logout,openChat,onJob}){
  const myVil  = driver?.village||"";
  const allAvail = DB.bookings.filter(b=>b.status==="Pending");
  const vilBks   = allAvail.filter(b=>b.village===myVil);
  const otherBks = allAvail.filter(b=>b.village!==myVil);
  const myBks    = DB.bookings.filter(b=>b.driverId===driver?.phone);
  const myOngoing= myBks.filter(b=>!["Pending","Completed","Cancelled"].includes(b.status));

  const inc      = calcIncentives(driver);
  const ac       = driver?.acresCompleted||0;
  const totalAc  = DEMO_DRIVERS.reduce((s,d)=>s+d.ac,0)+ac||1;
  // Dynamic: use actual company acres; show % relative to top driver×100 as proxy
  const estTarget = Math.max(totalAc, DEMO_DRIVERS[0].ac * TOTAL_DRIVERS * 0.5);
  const progress = Math.min((totalAc/estTarget)*100,100);
  const nextM    = inc.nextMilestone;
  const nextProgress = nextM? Math.min((ac/nextM.acres)*100,100):100;

  const accept=b=>{
    const idx=DB.bookings.findIndex(x=>x.id===b.id);
    if(idx>=0){DB.bookings[idx].status="Accepted";DB.bookings[idx].driverId=driver?.phone;DB.bookings[idx].drvWorkflow="accepted";}
    if(onJob) onJob(DB.bookings[idx>=0?idx:0]);
  };

  return(
    <div style={{background:"#0d1b2a",minHeight:"100vh"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0d47a1,#1565c0)",padding:"48px 16px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",position:"relative",zIndex:1}}>
          <div>
            <p style={{fontSize:12,color:"rgba(255,255,255,.7)",marginBottom:3}}>🚜 Driver Dashboard</p>
            <h1 style={{fontSize:22,fontWeight:900,color:"#fff"}}>{driver?.name||"Driver"}</h1>
            <p style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:2}}>🏘️ {driver?.village} • {driver?.tractorNum}</p>
          </div>
          <button onClick={logout} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",padding:"7px 12px",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Logout</button>
        </div>
        <div style={{display:"flex",gap:6,marginTop:10,position:"relative",zIndex:1,flexWrap:"wrap"}}>
          <span style={{background:"rgba(255,255,255,.18)",color:"#fff",padding:"2px 10px",borderRadius:999,fontSize:11,fontWeight:700}}>🏆 Rank #{inc.rank}</span>
          <span style={{background:"#ffd54f",color:"#5d3b00",padding:"2px 10px",borderRadius:999,fontSize:11,fontWeight:700}}>🌾 {ac} Ac</span>
          <span style={{background:"rgba(255,255,255,.18)",color:"#fff",padding:"2px 10px",borderRadius:999,fontSize:11,fontWeight:700}}>📊 {(driver?.completionRate||100).toFixed(0)}% CR</span>
          {driver?.approved&&<span style={{background:"#4caf50",color:"#fff",padding:"2px 10px",borderRadius:999,fontSize:11,fontWeight:700}}>✅ Active</span>}
        </div>
      </div>

      <div style={{padding:"14px 14px 100px"}}>

        {/* ── STATS ROW ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:12}}>
          {[["🌾","Acres",ac,"#64b5f6"],["✅","Jobs",driver?.completedJobs||0,"#81c784"],["⭐","Rating",`${(driver?.rating||5).toFixed(1)}`,"#ffb74d"],["📊","Score",inc.perfScore,"#ce93d8"]].map(([i,l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,.07)",borderRadius:12,padding:"12px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,.1)"}}>
              <p style={{fontSize:18,marginBottom:3}}>{i}</p>
              <p style={{color:c,fontWeight:900,fontSize:16}}>{v}</p>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:9,fontWeight:600,marginTop:2}}>{l}</p>
            </div>
          ))}
        </div>

        {/* ── INCENTIVE OVERVIEW ── */}
        <div style={{background:"linear-gradient(135deg,#4a148c,#7b1fa2)",borderRadius:18,padding:18,marginBottom:12,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,bottom:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <p style={{fontSize:14,fontWeight:800,color:"#fff"}}>💎 Total Incentives Earned</p>
            <span style={{background:"#e91e63",color:"#fff",padding:"2px 8px",borderRadius:999,fontSize:9,fontWeight:800,animation:"pulse 2s infinite"}}>● LIVE</span>
          </div>
          <p style={{fontSize:36,fontWeight:900,color:"#ffd54f",marginBottom:6}}>₹{inc.total.toLocaleString("en-IN")}</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,.65)",marginBottom:14}}>Budget cap: ₹2.25 Crore • Never exceeded</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[["🏅 Milestone",inc.milestone,"#a5d6a7"],["📈 Performance",inc.performance,"#90caf9"],["🏆 Leaderboard",inc.leaderboard,"#ffd54f"]].map(([l,v,cc])=>(
              <div key={l} style={{background:"rgba(255,255,255,.1)",borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
                <p style={{fontSize:10,color:"rgba(255,255,255,.7)",marginBottom:3}}>{l}</p>
                <p style={{fontSize:14,fontWeight:900,color:cc}}>₹{v.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MILESTONE PROGRESS ── */}
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:16,marginBottom:12,border:"1px solid rgba(255,255,255,.1)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <p style={{fontSize:14,fontWeight:800,color:"#fff"}}>🏅 Milestone Progress</p>
            {nextM&&<span style={{background:"#1565c0",color:"#fff",padding:"2px 8px",borderRadius:999,fontSize:10,fontWeight:800}}>Next: ₹{nextM.bonus.toLocaleString("en-IN")}</span>}
          </div>
          {nextM?(
            <>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>Progress to {nextM.label}</span>
                <span style={{fontSize:12,color:"#ffd54f",fontWeight:700}}>{ac}/{nextM.acres} Acres</span>
              </div>
              <div style={{background:"rgba(255,255,255,.15)",borderRadius:999,height:10,overflow:"hidden",marginBottom:6}}>
                <div style={{height:"100%",background:"linear-gradient(90deg,#ffd54f,#ff9800)",borderRadius:999,width:`${nextProgress}%`,transition:"width .5s"}}/>
              </div>
              <p style={{fontSize:11,color:"rgba(255,255,255,.5)",textAlign:"right"}}>{nextProgress.toFixed(1)}% • {nextM.acres-ac} Acres remaining</p>
            </>
          ):<p style={{color:"#ffd54f",fontWeight:700,fontSize:13}}>🎉 All milestones completed!</p>}
          <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
            {MILESTONES.map(m=>(
              <div key={m.acres} style={{background:ac>=m.acres?"#ffd54f":"rgba(255,255,255,.1)",borderRadius:8,padding:"5px 8px",textAlign:"center",minWidth:60}}>
                <p style={{fontSize:9,color:ac>=m.acres?"#5d3b00":"rgba(255,255,255,.5)",fontWeight:700}}>{m.label}</p>
                <p style={{fontSize:11,fontWeight:900,color:ac>=m.acres?"#5d3b00":"rgba(255,255,255,.4)"}}>₹{(m.bonus/1000).toFixed(0)}K</p>
                <p style={{fontSize:9,color:ac>=m.acres?"#2d5a00":"rgba(255,255,255,.3)"}}>{ac>=m.acres?"✅ Done":"🔒"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CAMPAIGN PROGRESS ── */}
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:16,marginBottom:12,border:"1px solid rgba(255,255,255,.1)"}}>
          <p style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:10}}>📈 Company Campaign Progress</p>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>Total Acres</span>
            <span style={{fontSize:12,color:"#64b5f6",fontWeight:700}}>{totalAc.toLocaleString("en-IN")} Ac (Growing...)</span>
          </div>
          <div style={{background:"rgba(255,255,255,.15)",borderRadius:999,height:10,overflow:"hidden",marginBottom:4}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#64b5f6,#1565c0)",borderRadius:999,width:`${progress}%`}}/>
          </div>
          <p style={{fontSize:11,color:"rgba(255,255,255,.5)",textAlign:"right"}}>{progress.toFixed(1)}%</p>
        </div>

        {/* ── Ongoing jobs ── */}
        {myOngoing.length>0&&<>
          <p style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:10}}>🔄 Active Jobs</p>
          {myOngoing.map(b=>(
            <div key={b.id} style={{background:"#fff",borderRadius:14,padding:14,marginBottom:10,border:"2px solid #ff9800"}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:22}}>{b.icon}</span>
                <div style={{flex:1}}>
                  <p style={{fontWeight:800,fontSize:14,color:"#1a3d2a"}}>{b.serviceNameHi}</p>
                  <p style={{fontSize:12,color:"#e65100",fontWeight:700}}>🔄 {b.drvWorkflow||b.status}</p>
                  <p style={{fontSize:12,color:"#7a9e8a"}}>👤 {b.name} • 📞 {b.phone}</p>
                </div>
                <p style={{fontWeight:900,color:"#e65100",fontSize:15}}>₹{b.amount}</p>
              </div>
              <button onClick={()=>onJob&&onJob(b)} style={{...S.btnO,padding:11}}>⚙️ Continue Work →</button>
            </div>
          ))}
        </>}

        {/* ── Available jobs ── */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <p style={{fontSize:14,fontWeight:800,color:"#fff"}}>⏳ Available Jobs</p>
          <button onClick={dnav.bookings} style={{background:"rgba(255,255,255,.15)",color:"#fff",border:"none",borderRadius:8,padding:"5px 11px",cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"inherit"}}>All Jobs →</button>
        </div>
        {(vilBks.length>0?vilBks:otherBks).slice(0,2).map(b=>(
          <div key={b.id} style={{background:"#fff",borderRadius:14,padding:14,marginBottom:10,border:`2px solid ${b.village===myVil?"#1565c0":"#d4edda"}`}}>
            <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
              {b.village===myVil&&<span style={{background:"#1565c0",color:"#fff",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:800}}>📍 Priority</span>}
              <span style={{background:"#e8f5e9",color:"#1a6b38",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:800}}>🌾 {b.acres}Ac</span>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
              <span style={{fontSize:22}}>{b.icon}</span>
              <div style={{flex:1}}>
                <p style={{fontWeight:800,fontSize:14,color:"#1a3d2a"}}>{b.serviceNameHi}</p>
                <p style={{fontSize:12,color:"#1565c0",fontWeight:700}}>👤 {b.name} • 📞 {b.phone}</p>
                <p style={{fontSize:12,color:"#7a9e8a"}}>🏘️ {b.village} • 📅 {fd(b.date)}</p>
                <p style={{fontSize:12,color:"#7a9e8a"}}>📍 {b.address}</p>
              </div>
              <p style={{fontWeight:900,color:"#1a6b38",fontSize:15,flexShrink:0}}>₹{b.amount}</p>
            </div>
            <button onClick={()=>accept(b)} style={{...S.btnG,padding:11}}>✅ Accept Job</button>
          </div>
        ))}
        {allAvail.length===0&&<div style={{textAlign:"center",padding:"24px",background:"rgba(255,255,255,.06)",borderRadius:14}}>
          <p style={{fontSize:36}}>📋</p><p style={{fontSize:13,color:"rgba(255,255,255,.6)",marginTop:8}}>कोई Available Job नहीं</p>
        </div>}
      </div>
      <DNNav active="home" dnav={dnav}/>
    </div>
  );
}

// ═══ DRIVER BOOKINGS (JOBS) ════════════════════════════════════════════════════
function DriverBookings({driver,dnav,openChat,onJob}){
  const [tab,setTab]=useState("available");
  const myVil=driver?.village||"";
  const avail=DB.bookings.filter(b=>b.status==="Pending");
  const vilBks=avail.filter(b=>b.village===myVil);
  const other=avail.filter(b=>b.village!==myVil);
  const myAll=DB.bookings.filter(b=>b.driverId===driver?.phone);
  const myActive=myAll.filter(b=>!["Completed","Cancelled"].includes(b.status)&&b.status!=="Pending");
  const myDone=myAll.filter(b=>b.status==="Completed");

  const accept=b=>{
    const idx=DB.bookings.findIndex(x=>x.id===b.id);
    if(idx>=0){DB.bookings[idx].status="Accepted";DB.bookings[idx].driverId=driver?.phone;DB.bookings[idx].drvWorkflow="accepted";}
    setTab("active");
  };

  const JCard=({b,onAct,actLabel,col})=>(
    <div style={{background:"#fff",borderRadius:14,padding:14,marginBottom:10,border:`2px solid ${col||"#d4edda"}`}}>
      <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
        <span style={{background:col||"#1a6b38",color:"#fff",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:800}}>{b.drvWorkflow||b.status}</span>
        {b.village===myVil&&<span style={{background:"#1565c0",color:"#fff",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:800}}>📍 Priority</span>}
      </div>
      <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
        <span style={{fontSize:22}}>{b.icon}</span>
        <div style={{flex:1}}>
          <p style={{fontWeight:800,fontSize:14,color:"#1a3d2a"}}>{b.serviceNameHi}</p>
          <p style={{fontSize:12,color:"#1565c0",fontWeight:700}}>👤 {b.name} • 📞 {b.phone}</p>
          <p style={{fontSize:12,color:"#7a9e8a"}}>🏘️ {b.village} • 🌾 {b.acres}Ac • 📅 {fd(b.date)}</p>
          <p style={{fontSize:12,color:"#7a9e8a"}}>📍 {b.address}</p>
          {b.note&&<p style={{fontSize:12,color:"#9ab5a3",marginTop:2}}>📝 {b.note}</p>}
        </div>
        <p style={{fontWeight:900,color:"#1a6b38",fontSize:15,flexShrink:0}}>₹{b.amount}</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        {onAct&&<button onClick={onAct} style={{flex:2,background:col||"#1a6b38",color:"#fff",border:"none",borderRadius:12,padding:"11px",cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:13}}>{actLabel}</button>}
        {openChat&&<button onClick={()=>openChat(b)} style={{flex:1,background:"#e3f2fd",color:"#1565c0",border:"2px solid #1565c0",borderRadius:12,padding:"11px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:12}}>💬</button>}
      </div>
    </div>
  );

  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={{...S.hdr,background:"linear-gradient(135deg,#1565c0,#0d47a1)"}}><div className="hd">📋</div>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>📋 Jobs</h1>
        <div style={{display:"flex",gap:6,marginTop:7,position:"relative",zIndex:1,flexWrap:"wrap"}}>
          <span style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>⏳ {avail.length}</span>
          <span style={{background:"#ffd54f",color:"#5d3b00",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>🔄 {myActive.length}</span>
          <span style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>✅ {myDone.length}</span>
        </div>
      </div>
      <div style={{padding:"13px",paddingBottom:100}} className="fi">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",background:"#dce8ff",borderRadius:14,padding:3,marginBottom:12}}>
          {[["available","⏳ New"],["active","🔄 Active"],["done","✅ Done"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?"#1565c0":"transparent",color:tab===t?"#fff":"#1565c0",border:"none",borderRadius:12,padding:"9px 4px",fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>{l}</button>
          ))}
        </div>
        {tab==="available"&&<>
          {vilBks.length>0&&<>{<p style={{fontSize:13,color:"#1565c0",marginBottom:9,fontWeight:700}}>📍 {myVil} — Priority Jobs</p>}
            {vilBks.map(b=><JCard key={b.id} b={b} onAct={()=>accept(b)} actLabel="✅ Accept" col="#1565c0"/>)}</>}
          {other.length>0&&<>
            <p style={{fontSize:13,color:"#7a9e8a",marginBottom:9,fontWeight:600,marginTop:4}}>🌍 Other Villages</p>
            {other.map(b=><JCard key={b.id} b={b} onAct={()=>accept(b)} actLabel="✅ Accept" col="#2d8a4e"/>)}
          </>}
          {avail.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#9ab5a3"}}><p style={{fontSize:48}}>📋</p><p style={{fontSize:14,marginTop:10}}>कोई Available Job नहीं</p></div>}
        </>}
        {tab==="active"&&<>
          {myActive.length===0?<div style={{textAlign:"center",padding:"40px 0",color:"#9ab5a3"}}><p style={{fontSize:48}}>🔄</p><p style={{fontSize:14,marginTop:10}}>कोई Active Job नहीं</p></div>
            :myActive.map(b=><JCard key={b.id} b={b} onAct={()=>onJob&&onJob(b)} actLabel={`⚙️ Continue — ${b.drvWorkflow||b.status}`} col="#ff9800"/>)}
        </>}
        {tab==="done"&&<>
          <p style={{fontSize:13,color:"#7a9e8a",marginBottom:9,fontWeight:600}}>{myDone.length} completed</p>
          {myDone.length===0?<div style={{textAlign:"center",padding:"40px 0",color:"#9ab5a3"}}><p style={{fontSize:48}}>✅</p><p style={{fontSize:14,marginTop:10}}>कोई Completed Job नहीं</p></div>
            :myDone.map(b=>(
              <div key={b.id} style={{background:"#fff",borderRadius:14,padding:12,marginBottom:8,border:"1.5px solid #a5d6a7"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:22}}>{b.icon}</span>
                  <div style={{flex:1}}><p style={{fontWeight:800,fontSize:13,color:"#1a3d2a"}}>{b.serviceNameHi}</p>
                    <p style={{fontSize:12,color:"#7a9e8a"}}>🏘️ {b.village} • 🌾 {b.completedAcres||b.acres}Ac</p>
                    <p style={{fontSize:12,color:"#7a9e8a"}}>✅ {ft(b.completedAt)}</p></div>
                  <p style={{fontWeight:900,color:"#2d8a4e",fontSize:14}}>₹{b.amount}</p>
                </div>
              </div>
            ))}
        </>}
      </div>
      <DNNav active="bookings" dnav={dnav}/>
    </div>
  );
}

// ═══ DRIVER JOB DETAIL — 7-Step Workflow ════════════════════════════════════
// Accepted → On The Way → Reached Farm → Work Started → Work Completed → Customer Confirmed → Payment Completed
const WORKFLOW = ["accepted","on_the_way","reached","work_started","work_completed","cust_confirmed","payment_done"];
const WORKFLOW_LABELS = {
  accepted:       {l:"Accepted",         btn:"🚗 On The Way करें",       next:"on_the_way",    col:"#1565c0"},
  on_the_way:     {l:"On The Way 🚗",    btn:"📍 Farm पर पहुंच गया",      next:"reached",       col:"#ff9800"},
  reached:        {l:"Reached Farm 📍",  btn:"▶ Start Work करें",         next:"work_started",  col:"#e65100"},
  work_started:   {l:"Work Started ▶",   btn:"✅ काम पूरा हो गया",        next:"work_completed",col:"#2d8a4e"},
  work_completed: {l:"Work Completed ✅", btn:"🔐 Customer Confirmation",  next:"cust_confirmed",col:"#1a6b38"},
  cust_confirmed: {l:"Customer Confirmed",btn:"💰 Payment Complete करें", next:"payment_done",  col:"#4caf50"},
  payment_done:   {l:"Payment Done 💰",  btn:null,                         next:null,            col:"#1a237e"},
};

function DriverJobDetail({job,driver,setDriver,back,onComplete}){
  const getWf = ()=>{
    if(!job) return "accepted";
    return DB.bookings.find(x=>x.id===job.id)?.drvWorkflow||job.drvWorkflow||"accepted";
  };
  const [wf,setWf]           = useState(getWf);
  const [photo,setPhoto]      = useState(null);
  const [photoLoad,setPL]     = useState(false);
  const [actualAc,setActualAc]= useState(String(job?.acres||1));
  const [custOtp,setCOtp]     = useState("");
  const [otpErr,setOErr]      = useState("");
  const [gps,setGps]          = useState(null);

  if(!job) return null;
  const live = DB.bookings.find(x=>x.id===job.id)||job;
  const wfInfo = WORKFLOW_LABELS[wf]||WORKFLOW_LABELS.accepted;
  const wfIdx  = WORKFLOW.indexOf(wf);
  const isDone = wf==="payment_done";

  const advance = () => {
    if(!wfInfo.next) return;
    const idx=DB.bookings.findIndex(x=>x.id===job.id);
    const g={lat:20.7394+Math.random()*0.01,lng:78.9534+Math.random()*0.01};
    if(wf==="reached") setGps(g);
    if(idx>=0) DB.bookings[idx].drvWorkflow=wfInfo.next;
    if(wf==="payment_done"||wfInfo.next==="payment_done"){
      // finalize
      if(idx>=0){DB.bookings[idx].status="Completed";DB.bookings[idx].completedAt=new Date().toISOString();DB.bookings[idx].completedAcres=parseFloat(actualAc);}
      const d=DB.drivers[driver?.phone];
      const addAc=parseFloat(actualAc);
      if(d){d.acresCompleted=(d.acresCompleted||0)+addAc;d.earnings=(d.earnings||0)+job.amount;d.completedJobs=(d.completedJobs||0)+1;d.completionRate=Math.min(100,(d.completionRate||100));}
      if(setDriver)setDriver(p=>({...p,acresCompleted:(p.acresCompleted||0)+addAc,earnings:(p.earnings||0)+job.amount,completedJobs:(p.completedJobs||0)+1}));
      onComplete&&onComplete();
      return;
    }
    setWf(wfInfo.next);
  };

  const doVerifyOtp=()=>{
    if(custOtp!=="1234"){setOErr("❌ OTP गलत! Customer से पूछें — Demo OTP: 1234");return;}
    advance();
  };

  if(isDone||live.status==="Completed") return(
    <div style={{background:"linear-gradient(170deg,#e8f5e9,#f0faf0)",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"22px 18px",textAlign:"center"}}>
      <div style={{fontSize:80,animation:"pop .5s cubic-bezier(.16,1,.3,1)",marginBottom:14}}>🎉</div>
      <h1 style={{fontSize:26,fontWeight:900,color:"#1a6b38",marginBottom:6}}>Job Complete!</h1>
      <p style={{fontSize:16,color:"#4a7c5a",marginBottom:4}}>₹{job.amount} Earned!</p>
      <p style={{fontSize:14,color:"#4a7c5a",marginBottom:24}}>🌾 {actualAc} Acres • Incentive Updated!</p>
      <button style={S.btnG} onClick={onComplete}>🏠 Dashboard →</button>
    </div>
  );

  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={{...S.hdr,background:`linear-gradient(135deg,${wfInfo.col},${wfInfo.col}cc)`}}>
        <button style={S.bkb} onClick={back}>← Back</button>
        <h1 style={{fontSize:20,fontWeight:900,position:"relative",zIndex:1}}>{job.icon} {job.serviceNameHi}</h1>
        <p style={{opacity:.85,fontSize:13,marginTop:3,position:"relative",zIndex:1}}>Step {wfIdx+1}/7 — {wfInfo.l}</p>
      </div>

      <div style={{padding:"16px 15px 100px"}} className="fi">
        {/* Workflow stepper */}
        <div style={{...S.card,padding:"12px 14px",marginBottom:12}}>
          <p style={{fontSize:12,fontWeight:700,color:"#1a3d2a",marginBottom:8}}>📋 Workflow Progress</p>
          <div style={{display:"flex",gap:3,alignItems:"center",overflowX:"auto"}}>
            {WORKFLOW.map((w,i)=>(
              <div key={w} style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:i<wfIdx?"#4caf50":i===wfIdx?wfInfo.col:"#e0e0e0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:i<wfIdx?14:11,color:"#fff",fontWeight:900,flexShrink:0}}>
                  {i<wfIdx?"✓":i+1}
                </div>
                {i<WORKFLOW.length-1&&<div style={{width:16,height:2,background:i<wfIdx?"#4caf50":"#e0e0e0",flexShrink:0}}/>}
              </div>
            ))}
          </div>
          <p style={{fontSize:11,color:"#7a9e8a",marginTop:8}}>{wfInfo.l}</p>
        </div>

        {/* Customer detail card */}
        <div style={{...S.card,border:`2px solid ${wfInfo.col}22`,background:"#f8fbff"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#1565c0",marginBottom:12}}>👤 Customer & Booking Details</h3>
          {[["👤 Customer",live.name],["📞 Mobile",live.phone||"N/A"],["🏘️ Village",live.village],["📍 Farm Address",live.address||"N/A"],["🛠️ Service",live.serviceNameHi],["🌾 Booked Acres",`${live.acres} Acre`],["💰 Amount",`₹${live.amount}`],["📅 Date",fd(live.date)],live.note&&["📝 Notes",live.note]].filter(Boolean).map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #e3f2fd"}}>
              <span style={{fontSize:12,color:"#1565c0",fontWeight:600,flexShrink:0}}>{k}</span>
              <span style={{fontSize:12,color:"#1a3d2a",fontWeight:700,textAlign:"right",maxWidth:"60%"}}>{v}</span>
            </div>
          ))}
          {/* Action buttons */}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button style={{flex:1,background:"#4caf50",color:"#fff",border:"none",borderRadius:12,padding:"10px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
              📞 Call Customer
            </button>
            <button style={{flex:1,background:"#4285F4",color:"#fff",border:"none",borderRadius:12,padding:"10px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
              🗺️ Open Maps
            </button>
          </div>
        </div>

        {/* GPS card */}
        {gps&&<div style={{...S.card,background:"#e8f5e9",border:"1.5px solid #a5d6a7",marginBottom:8}}>
          <p style={{fontWeight:700,color:"#1a6b38",fontSize:13}}>📍 Location Captured ✅</p>
          <p style={{fontSize:12,color:"#4a7c5a",marginTop:3}}>{gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}</p>
        </div>}

        {/* Work completed step: show photo + actual acres */}
        {(wf==="work_started"||wf==="work_completed")&&<div style={{...S.card,border:"2px solid #2d8a4e"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#2d8a4e",marginBottom:12}}>📸 Completion Details</h3>
          <label style={S.lbl}>🌾 Actual Acres Completed</label>
          <input style={{...S.inp,fontSize:18,fontWeight:700,textAlign:"center",marginBottom:12}} type="number" min=".5" step=".5" value={actualAc} onChange={e=>setActualAc(e.target.value)}/>
          <label style={S.lbl}>📷 Upload Work Photos</label>
          {!photo&&!photoLoad&&<div style={{border:"2px dashed #2d8a4e",borderRadius:12,overflow:"hidden",marginBottom:10}}>
            <div style={{display:"flex"}}>
              <button onClick={()=>{setPL(true);setTimeout(()=>{setPL(false);setPhoto("work_photo.jpg");},1400);}} style={{flex:1,padding:"16px 8px",background:"#fff",border:"none",borderRight:"1px solid #d4edda",cursor:"pointer",textAlign:"center",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:28}}>📷</span><span style={{fontSize:12,fontWeight:700}}>Camera</span>
              </button>
              <button onClick={()=>{setPL(true);setTimeout(()=>{setPL(false);setPhoto("gallery_photo.jpg");},1400);}} style={{flex:1,padding:"16px 8px",background:"#fff",border:"none",cursor:"pointer",textAlign:"center",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:28}}>🖼️</span><span style={{fontSize:12,fontWeight:700}}>Gallery</span>
              </button>
            </div>
          </div>}
          {photoLoad&&<div style={{border:"2px solid #2d8a4e",borderRadius:10,padding:14,textAlign:"center",marginBottom:10,background:"#e8f5e9"}}>
            <div style={{fontSize:26,display:"inline-block",animation:"sp 1s linear infinite"}}>🔄</div>
            <p style={{fontWeight:700,color:"#2d8a4e",fontSize:13,marginTop:6}}>Photo upload हो रहा है...</p>
          </div>}
          {photo&&<div style={{background:"#e8f5e9",borderRadius:12,padding:"9px 12px",marginBottom:10,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:20}}>📷</span>
            <div style={{flex:1}}><p style={{fontWeight:700,color:"#1a6b38",fontSize:13}}>✅ Photo Uploaded — {photo}</p></div>
            <button onClick={()=>setPhoto(null)} style={{background:"#ffcdd2",border:"none",borderRadius:7,padding:"5px 9px",cursor:"pointer",color:"#c62828",fontWeight:700,fontFamily:"inherit"}}>🗑️</button>
          </div>}
        </div>}

        {/* OTP step */}
        {wf==="work_completed"&&<div style={S.card}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#1a3d2a",marginBottom:4}}>🔐 Customer OTP Verify</h3>
          <p style={{fontSize:12,color:"#7a9e8a",marginBottom:8}}>Customer से 4-digit OTP लें</p>
          <p style={{fontSize:11,color:"#9ab5a3",marginBottom:10}}>Demo OTP: <b style={{color:"#c62828"}}>1234</b></p>
          <input style={{...S.inp,fontSize:22,fontWeight:800,textAlign:"center",letterSpacing:10,marginBottom:8}} placeholder="0000" maxLength={4} inputMode="numeric" value={custOtp} onChange={e=>{setCOtp(e.target.value.replace(/\D/g,"").slice(0,4));setOErr("");}}/>
          {otpErr&&<p style={{color:"#EF4444",fontSize:13,marginBottom:10,fontWeight:700,textAlign:"center"}}>{otpErr}</p>}
          <button onClick={doVerifyOtp} style={{...S.btnG,padding:14}}>✅ OTP Verify & Confirm</button>
        </div>}

        {/* Main action button */}
        {wf!=="work_completed"&&!isDone&&(
          <button onClick={advance} style={{...S.btnG,padding:16,fontSize:16,marginTop:4,background:`linear-gradient(135deg,${wfInfo.col},${wfInfo.col}cc)`,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <span style={{fontSize:20}}>→</span> {wfInfo.btn}
          </button>
        )}
      </div>
    </div>
  );
}

// ═══ DRIVER EARNINGS ════════════════════════════════════════════════════════
function DriverEarnings({driver,dnav}){
  const done=DB.bookings.filter(b=>b.driverId===driver?.phone&&b.status==="Completed");
  const total=driver?.earnings||0;
  const inc=calcIncentives(driver);
  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={{...S.hdr,background:"linear-gradient(135deg,#1565c0,#0d47a1)"}}><div className="hd">💰</div>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>💰 Earnings & Incentives</h1>
      </div>
      <div style={{padding:"16px 15px",paddingBottom:100}} className="fi">
        <div style={{background:"linear-gradient(135deg,#1a237e,#283593)",borderRadius:18,padding:20,marginBottom:12,color:"#fff",textAlign:"center"}}>
          <p style={{fontSize:14,opacity:.8,marginBottom:4}}>Total Service Earnings</p>
          <p style={{fontSize:38,fontWeight:900,color:"#ffd54f",margin:"4px 0"}}>{inr(total)}</p>
          <p style={{fontSize:13,opacity:.75}}>{done.length} Jobs Completed</p>
        </div>
        {/* Incentive pools */}
        <div style={{...S.card,border:"2px solid #7b1fa2",background:"#f3e5f5",marginBottom:12}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#4a148c",marginBottom:12}}>💎 Incentive Breakdown</h3>
          <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",marginBottom:4}}>
            <span style={{fontSize:12,color:"#555"}}>Total Budget (Cap)</span>
            <span style={{fontSize:12,fontWeight:700,color:"#c62828"}}>₹2.25 Crore MAX</span>
          </div>
          {[["🏅 Milestone Pool",`₹${(POOL_MILESTONE/100000).toFixed(2)}L total`,inc.milestone,"#1a6b38"],["📈 Performance Pool",`₹${(POOL_PERFORMANCE/100000).toFixed(1)}L total`,inc.performance,"#1565c0"],["🏆 Leaderboard Pool",`₹${(POOL_LEADERBOARD/100000).toFixed(1)}L total`,inc.leaderboard,"#e65100"]].map(([l,sub,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:"#fff",borderRadius:10,marginBottom:8,border:`1.5px solid ${c}33`}}>
              <div><p style={{fontSize:13,fontWeight:700,color:"#1a3d2a"}}>{l}</p><p style={{fontSize:11,color:"#7a9e8a"}}>{sub}</p></div>
              <p style={{fontSize:16,fontWeight:900,color:c}}>₹{v.toLocaleString("en-IN")}</p>
            </div>
          ))}
          <div style={{borderTop:"2px solid #7b1fa2",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:800,color:"#4a148c"}}>💎 Total Incentive</span>
            <span style={{fontSize:20,fontWeight:900,color:"#4a148c"}}>₹{inc.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["📋","Jobs",done.length,"#1565c0"],["🌾","Acres",driver?.acresCompleted||0,"#2d8a4e"],["⭐","Rating",`${(driver?.rating||5).toFixed(1)}/5`,"#e65100"],["🏆","Rank",`#${inc.rank}`,"#6a1b9a"]].map(([i,l,v,c])=>(
            <div key={l} style={{...S.card,textAlign:"center",marginBottom:0}}>
              <div style={{fontSize:22,marginBottom:3}}>{i}</div>
              <p style={{color:c,fontWeight:900,fontSize:20}}>{v}</p>
              <p style={{color:"#7a9e8a",fontSize:11,fontWeight:600,marginTop:1}}>{l}</p>
            </div>
          ))}
        </div>
      </div>
      <DNNav active="earnings" dnav={dnav}/>
    </div>
  );
}

// ═══ DRIVER LEADERBOARD ══════════════════════════════════════════════════════
function DriverLeaderboard({driver,dnav}){
  const myAc   = driver?.acresCompleted||0;
  const myRat  = driver?.rating||5;
  // Build live board: demo drivers + current logged-in driver
  const board = [
    ...DEMO_DRIVERS.map(d=>({...d,isMe:false})),
    {name:driver?.name||"आप",ph:driver?.phone,village:driver?.village||"-",ac:myAc,rating:myRat,jobs:driver?.completedJobs||0,cr:driver?.completionRate||100,isMe:true},
  ].sort((a,b)=>b.ac-a.ac||b.rating-a.rating);

  const totalAc = board.reduce((s,d)=>s+d.ac,0)||1;
  const myRank  = board.findIndex(d=>d.isMe)+1;
  const lbShare = myRank<=20 ? [12,10,8,7,6,5.5,5,4.5,4,3.5,3,2.5,2,1.8,1.6,1.4,1.2,1,0.8,0.7][myRank-1] : 0;
  const myLbEarning = Math.round((lbShare/100)*POOL_LEADERBOARD);

  const medal = i => i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`;
  const medalBg = i => i===0?"#ffd54f":i===1?"#e0e0e0":i===2?"#ff8a65":"#f5f5f5";
  const medalFg = i => i<3?"#333":"#555";

  return(
    <div style={{background:"#0d1b2a",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#4a148c,#6a1b9a)",padding:"48px 16px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
        <div className="hd" style={{color:"rgba(255,255,255,.1)",fontSize:60}}>🏆</div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#fff",position:"relative",zIndex:1}}>🏆 Leaderboard</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,.75)",marginTop:3,position:"relative",zIndex:1}}>
          Top 100 Drivers • Leaderboard Pool: {inr(POOL_LEADERBOARD)}
        </p>
        <div style={{display:"flex",gap:7,marginTop:10,position:"relative",zIndex:1,flexWrap:"wrap"}}>
          <span style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"3px 10px",borderRadius:999,fontSize:12,fontWeight:700}}>Your Rank: #{myRank}</span>
          <span style={{background:"#ffd54f",color:"#5d3b00",padding:"3px 10px",borderRadius:999,fontSize:12,fontWeight:700}}>🌾 {myAc} Acres</span>
          {myRank<=20&&<span style={{background:"#4caf50",color:"#fff",padding:"3px 10px",borderRadius:999,fontSize:12,fontWeight:700}}>💎 Top 20!</span>}
        </div>
      </div>

      <div style={{padding:"14px 14px 100px"}}>
        {/* My earnings card */}
        <div style={{background:"linear-gradient(135deg,#4a148c,#7b1fa2)",borderRadius:16,padding:16,marginBottom:14,color:"#fff"}}>
          <p style={{fontSize:13,opacity:.8,marginBottom:4}}>Your Leaderboard Incentive</p>
          <p style={{fontSize:32,fontWeight:900,color:"#ffd54f",marginBottom:4}}>{inr(myLbEarning)}</p>
          <p style={{fontSize:12,opacity:.7}}>Rank #{myRank} • {myRank<=20?`${lbShare}% of Leaderboard Pool`:"Enter Top 20 to earn"}</p>
        </div>

        {/* Top 3 podium */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr 1fr",gap:8,marginBottom:14,alignItems:"flex-end"}}>
          {[board[1],board[0],board[2]].map((d,idx)=>{
            const realIdx = idx===0?1:idx===1?0:2;
            if(!d) return <div key={idx}/>;
            return(
              <div key={d.ph} style={{background:d.isMe?"#e3f2fd":"#fff",borderRadius:14,padding:"14px 8px",textAlign:"center",border:d.isMe?"2px solid #1565c0":"none",boxShadow:"0 4px 16px rgba(0,0,0,.2)"}}>
                <p style={{fontSize:realIdx===0?32:26,marginBottom:4}}>{medal(realIdx)}</p>
                <p style={{fontSize:11,fontWeight:800,color:"#1a3d2a"}}>{d.name.split(" ")[0]}{d.isMe?" (आप)":""}</p>
                <p style={{fontSize:10,color:"#7a9e8a"}}>{d.village}</p>
                <p style={{fontSize:13,fontWeight:900,color:"#4a148c",marginTop:4}}>{d.ac.toLocaleString("en-IN")}Ac</p>
                <p style={{fontSize:10,color:"#e65100",fontWeight:700}}>⭐{d.rating.toFixed(1)}</p>
                <p style={{fontSize:10,color:"#1a6b38",fontWeight:700,marginTop:2}}>{inr(Math.round(([12,10,8][realIdx]/100)*POOL_LEADERBOARD))}</p>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div style={{background:"rgba(255,255,255,.05)",borderRadius:16,padding:12,border:"1px solid rgba(255,255,255,.1)"}}>
          <p style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,.8)",marginBottom:10}}>Full Rankings (Top 100)</p>
          {board.slice(0,100).map((d,i)=>{
            const share = i<20?[12,10,8,7,6,5.5,5,4.5,4,3.5,3,2.5,2,1.8,1.6,1.4,1.2,1,0.8,0.7][i]:0;
            const earning = Math.round((share/100)*POOL_LEADERBOARD);
            return(
              <div key={d.ph||i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,background:d.isMe?"rgba(21,101,192,.3)":"transparent",border:d.isMe?"1px solid #1565c0":"1px solid rgba(255,255,255,.05)",marginBottom:4}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:i<3?medalBg(i):"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:i<3?15:11,fontWeight:900,color:i<3?medalFg(i):"rgba(255,255,255,.7)",flexShrink:0}}>
                  {i<3?medal(i):`#${i+1}`}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:13,color:d.isMe?"#64b5f6":"rgba(255,255,255,.9)"}}>{d.name}{d.isMe?" 👈":""}</p>
                  <p style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>🏘️ {d.village} • ⭐{d.rating.toFixed(1)} • {d.cr}% CR</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{fontWeight:800,fontSize:12,color:"#ffd54f"}}>{d.ac.toLocaleString("en-IN")}Ac</p>
                  <p style={{fontSize:10,color:earning>0?"#81c784":"rgba(255,255,255,.4)",fontWeight:700}}>{earning>0?inr(earning):"—"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DNNav active="leaderboard" dnav={dnav}/>
    </div>
  );
}

// ═══ DRIVER INCENTIVE ════════════════════════════════════════════════════════
function DriverIncentive({driver,dnav}){
  const inc     = calcIncentives(driver);
  const myAc    = driver?.acresCompleted||0;
  const totalAc = DEMO_DRIVERS.reduce((s,d)=>s+d.ac,0)+myAc||1;
  const progress= Math.min((totalAc/300000)*100,100);

  return(
    <div style={{background:"#0d1b2a",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#1a237e,#283593)",padding:"48px 16px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
        <div className="hd" style={{color:"rgba(255,255,255,.1)",fontSize:60}}>💎</div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#fff",position:"relative",zIndex:1}}>💎 My Incentives</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,.75)",marginTop:3,position:"relative",zIndex:1}}>
          Total Budget: ₹2.25 Crore • Never Exceeded
        </p>
      </div>

      <div style={{padding:"14px 14px 100px"}}>
        {/* Total earned */}
        <div style={{background:"linear-gradient(135deg,#4a148c,#7b1fa2)",borderRadius:18,padding:20,marginBottom:12,color:"#fff",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,bottom:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <p style={{fontSize:14,fontWeight:800}}>💎 Total Incentive Earned</p>
            <span style={{background:"#e91e63",color:"#fff",padding:"2px 8px",borderRadius:999,fontSize:9,fontWeight:800}}>● LIVE</span>
          </div>
          <p style={{fontSize:42,fontWeight:900,color:"#ffd54f",margin:"4px 0"}}>{inr(inc.total)}</p>
          <p style={{fontSize:11,opacity:.7}}>Rank #{inc.rank} • Performance Score: {inc.perfScore}</p>
          <div style={{background:"rgba(255,255,255,.1)",borderRadius:10,padding:10,marginTop:12}}>
            <p style={{fontSize:11,opacity:.8}}>Formula: Milestone + Performance + Leaderboard</p>
            <p style={{fontSize:12,fontWeight:700,color:"#ffd54f",marginTop:4}}>{inr(inc.milestone)} + {inr(inc.performance)} + {inr(inc.leaderboard)}</p>
          </div>
        </div>

        {/* 3 Pools */}
        {[
          {label:"🏅 Milestone Pool",total:POOL_MILESTONE, earned:inc.milestone, color:"#ff9800",sub:"Earned by completing acre milestones"},
          {label:"📈 Performance Pool",total:POOL_PERFORMANCE,earned:inc.performance,color:"#2196f3",sub:"Acres × Completion Rate × Rating"},
          {label:"🏆 Leaderboard Pool",total:POOL_LEADERBOARD,earned:inc.leaderboard,color:"#9c27b0",sub:"Top 20 Drivers share this pool"},
        ].map(p=>(
          <div key={p.label} style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:16,marginBottom:10,border:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <p style={{fontSize:14,fontWeight:800,color:"#fff"}}>{p.label}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,.55)",marginTop:2}}>{p.sub}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:1}}>Total pool: {inr(p.total)}</p>
              </div>
              <p style={{fontSize:22,fontWeight:900,color:p.color,flexShrink:0}}>{inr(p.earned)}</p>
            </div>
            <div style={{background:"rgba(255,255,255,.12)",borderRadius:999,height:8,overflow:"hidden"}}>
              <div style={{height:"100%",background:p.color,borderRadius:999,width:`${Math.min((p.earned/p.total)*100*50,100)}%`}}/>
            </div>
          </div>
        ))}

        {/* Milestones */}
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:16,marginBottom:12,border:"1px solid rgba(255,255,255,.1)"}}>
          <p style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:12}}>🏅 Milestone Progress</p>
          {MILESTONES.map((m,i)=>{
            const done = myAc>=m.acres;
            const pct  = done?100:Math.min((myAc/m.acres)*100,99);
            const prev = i===0?0:MILESTONES[i-1].acres;
            const range= m.acres-prev;
            const segPct= done?100:Math.min(((myAc-prev)/range)*100,99);
            return(
              <div key={m.acres} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:done?"#ffd54f":"rgba(255,255,255,.8)"}}>{done?"✅":"🔒"} {m.label}</span>
                  <span style={{fontSize:12,fontWeight:900,color:done?"#ffd54f":"rgba(255,255,255,.5)"}}>{inr(m.bonus)}</span>
                </div>
                <div style={{background:"rgba(255,255,255,.15)",borderRadius:999,height:7,overflow:"hidden"}}>
                  <div style={{height:"100%",background:done?"#ffd54f":"rgba(255,183,0,.5)",borderRadius:999,width:`${segPct}%`,transition:"width .5s"}}/>
                </div>
                <p style={{fontSize:10,color:"rgba(255,255,255,.4)",textAlign:"right",marginTop:2}}>{myAc}/{m.acres} Ac ({pct.toFixed(1)}%)</p>
              </div>
            );
          })}
        </div>

        {/* Campaign progress */}
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:16,border:"1px solid rgba(255,255,255,.1)"}}>
          <p style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:10}}>📈 Campaign Overview</p>
          {[
            ["My Acres",`${myAc.toLocaleString("en-IN")} Ac`,"#ffd54f"],
            ["Company Total Acres",`${totalAc.toLocaleString("en-IN")} Ac`,"#64b5f6"],
            ["My Share %",`${totalAc>0?((myAc/totalAc)*100).toFixed(3):0}%`,"#81c784"],
            ["My Rank",`#${inc.rank}`,"#ce93d8"],
            ["Performance Score",`${inc.perfScore}`,"#ffcc80"],
            ["Total Budget Cap","₹2.25 Crore","#ef9a9a"],
          ].map(([k,v,c])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{k}</span>
              <span style={{fontSize:13,fontWeight:800,color:c}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>Company Progress</span>
              <span style={{fontSize:12,color:"#64b5f6",fontWeight:700}}>{totalAc.toLocaleString("en-IN")} / 3,00,000 Ac</span>
            </div>
            <div style={{background:"rgba(255,255,255,.15)",borderRadius:999,height:10,overflow:"hidden"}}>
              <div style={{height:"100%",background:"linear-gradient(90deg,#64b5f6,#1565c0)",borderRadius:999,width:`${progress}%`}}/>
            </div>
            <p style={{fontSize:10,color:"rgba(255,255,255,.4)",textAlign:"right",marginTop:3}}>{progress.toFixed(2)}%</p>
          </div>
        </div>
      </div>
      <DNNav active="incentive" dnav={dnav}/>
    </div>
  );
}

// ═══ DRIVER RANK (Performance & Rank detail) ══════════════════════════════════
function DriverRank({driver,dnav}){
  const inc = calcIncentives(driver);
  const myAc= driver?.acresCompleted||0;
  const board=[...DEMO_DRIVERS,{name:driver?.name||"आप",ph:driver?.phone,village:driver?.village||"-",ac:myAc,rating:driver?.rating||5,jobs:driver?.completedJobs||0,cr:driver?.completionRate||100,isMe:true}].sort((a,b)=>b.ac*(b.cr/100)*(b.rating/5)-a.ac*(a.cr/100)*(a.rating/5));
  const perfRank=board.findIndex(d=>d.isMe)+1;
  const totalAc=board.reduce((s,d)=>s+d.ac,0)||1;

  return(
    <div style={{background:"#0d1b2a",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#006064,#00838f)",padding:"48px 16px 20px",position:"relative",overflow:"hidden"}}>
        <div className="hd" style={{color:"rgba(255,255,255,.1)",fontSize:60}}>📊</div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#fff",position:"relative",zIndex:1}}>📊 Performance & Rank</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,.75)",marginTop:3,position:"relative",zIndex:1}}>Acres + Completion Rate + Rating</p>
      </div>
      <div style={{padding:"14px 14px 100px"}}>
        {/* Score card */}
        <div style={{background:"linear-gradient(135deg,#006064,#00838f)",borderRadius:18,padding:20,marginBottom:12,color:"#fff"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[["🏆 Acre Rank",`#${inc.rank}`,"#ffd54f"],["📊 Perf Rank",`#${perfRank}`,"#80deea"],["📈 Perf Score",`${inc.perfScore}`,"#a5d6a7"],["💎 Incentive",inr(inc.performance),"#fff"]].map(([l,v,c])=>(
              <div key={l} style={{background:"rgba(0,0,0,.2)",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
                <p style={{fontSize:11,color:"rgba(255,255,255,.7)",marginBottom:4}}>{l}</p>
                <p style={{fontSize:18,fontWeight:900,color:c}}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(0,0,0,.2)",borderRadius:10,padding:12}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,.7)",marginBottom:6}}>Performance Score Formula</p>
            <p style={{fontSize:13,color:"#80deea",fontWeight:700}}>Score = Acres × (Completion% / 100) × (Rating / 5)</p>
            <p style={{fontSize:13,color:"#ffd54f",fontWeight:900,marginTop:6}}>= {myAc} × {((driver?.completionRate||100)/100).toFixed(2)} × {((driver?.rating||5)/5).toFixed(2)} = {inc.perfScore}</p>
          </div>
        </div>

        {/* My stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {[["🌾","Acres Covered",myAc,"#ffd54f"],["✅","Completion Rate",`${(driver?.completionRate||100).toFixed(0)}%`,"#81c784"],["⭐","Average Rating",`${(driver?.rating||5).toFixed(1)}/5`,"#ffb74d"],["📋","Jobs Done",driver?.completedJobs||0,"#64b5f6"]].map(([ico,l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:"14px 12px",textAlign:"center",border:"1px solid rgba(255,255,255,.1)"}}>
              <p style={{fontSize:26,marginBottom:4}}>{ico}</p>
              <p style={{fontSize:18,fontWeight:900,color:c}}>{v}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600}}>{l}</p>
            </div>
          ))}
        </div>

        {/* Performance leaderboard */}
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:14,border:"1px solid rgba(255,255,255,.1)"}}>
          <p style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,.8)",marginBottom:10}}>📊 Performance Rankings (Top 20)</p>
          {board.slice(0,20).map((d,i)=>{
            const pScore=Math.round(d.ac*(d.cr/100)*(d.rating/5)*10)/10;
            const totalPerf=board.reduce((s,x)=>s+x.ac*(x.cr/100)*(x.rating/5),0)||1;
            const perfEarned=Math.round((d.ac*(d.cr/100)*(d.rating/5)/totalPerf)*POOL_PERFORMANCE);
            return(
              <div key={d.ph||i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 8px",borderRadius:10,background:d.isMe?"rgba(0,131,143,.3)":"transparent",border:d.isMe?"1px solid #00838f":"1px solid rgba(255,255,255,.05)",marginBottom:4}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:i<3?"#ffd54f":"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:i<3?14:10,fontWeight:900,color:i<3?"#333":"rgba(255,255,255,.7)",flexShrink:0}}>
                  {i<3?["🥇","🥈","🥉"][i]:`#${i+1}`}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:12,color:d.isMe?"#80deea":"rgba(255,255,255,.9)"}}>{d.name}{d.isMe?" 👈":""}</p>
                  <p style={{fontSize:10,color:"rgba(255,255,255,.45)"}}>Score: {pScore} • {d.ac}Ac • ⭐{d.rating.toFixed(1)}</p>
                </div>
                <p style={{fontSize:11,fontWeight:800,color:"#81c784",flexShrink:0}}>{inr(perfEarned)}</p>
              </div>
            );
          })}
        </div>
      </div>
      <DNNav active="rank" dnav={dnav}/>
    </div>
  );
}

// ═══ DRIVER PERFORMANCE ═══════════════════════════════════════════════════════
function DriverPerformance({driver,dnav}){
  const inc=calcIncentives(driver);
  const myAc=driver?.acresCompleted||0;
  const cr=driver?.completionRate||100;
  const rating=driver?.rating||5;
  const nextInc=MILESTONES.find(m=>myAc<m.acres);

  return(
    <div style={{background:"#0d1b2a",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#1b5e20,#2e7d32)",padding:"48px 16px 20px",position:"relative",overflow:"hidden"}}>
        <div className="hd" style={{color:"rgba(255,255,255,.1)",fontSize:60}}>📈</div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#fff",position:"relative",zIndex:1}}>📈 Performance</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,.75)",marginTop:3,position:"relative",zIndex:1}}>Real-time stats & next rewards</p>
      </div>
      <div style={{padding:"14px 14px 100px"}}>
        <div style={{background:"linear-gradient(135deg,#1b5e20,#388e3c)",borderRadius:18,padding:20,marginBottom:12,color:"#fff"}}>
          <p style={{fontSize:14,fontWeight:800,marginBottom:4}}>📊 Your Performance Score</p>
          <p style={{fontSize:48,fontWeight:900,color:"#ffd54f",margin:"4px 0"}}>{inc.perfScore}</p>
          <p style={{fontSize:12,opacity:.75}}>{myAc} Acres × {cr.toFixed(0)}% CR × {(rating/5).toFixed(2)} Rating</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {[["🌾","Total Acres",myAc,"#ffd54f"],["✅","Completion Rate",`${cr.toFixed(0)}%`,"#a5d6a7"],["⭐","Rating",`${rating.toFixed(1)}/5`,"#ffb74d"],["🏆","Rank",`#${inc.rank}`,"#ce93d8"],["💎","Perf Incentive",inr(inc.performance),"#80deea"],["🏅","Milestone",inr(inc.milestone),"#ff8a65"]].map(([i,l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:"14px 12px",textAlign:"center",border:"1px solid rgba(255,255,255,.1)"}}>
              <p style={{fontSize:20,marginBottom:4}}>{i}</p>
              <p style={{fontSize:16,fontWeight:900,color:c}}>{v}</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:2}}>{l}</p>
            </div>
          ))}
        </div>
        {nextInc&&<div style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:16,marginBottom:12,border:"1px solid rgba(255,255,255,.1)"}}>
          <p style={{fontSize:13,fontWeight:800,color:"#ffd54f",marginBottom:8}}>🎯 Upcoming Reward</p>
          <p style={{fontSize:15,color:"#fff",fontWeight:700}}>Next Milestone: {nextInc.label}</p>
          <p style={{fontSize:13,color:"rgba(255,255,255,.6)",marginTop:4}}>Reward: <span style={{color:"#ffd54f",fontWeight:900}}>{inr(nextInc.bonus)}</span></p>
          <p style={{fontSize:13,color:"rgba(255,255,255,.6)",marginTop:2}}>Remaining: <span style={{color:"#81c784",fontWeight:700}}>{nextInc.acres-myAc} Acres more</span></p>
          <div style={{background:"rgba(255,255,255,.15)",borderRadius:999,height:8,overflow:"hidden",marginTop:10}}>
            <div style={{height:"100%",background:"#ffd54f",borderRadius:999,width:`${Math.min((myAc/nextInc.acres)*100,99)}%`}}/>
          </div>
        </div>}
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:16,border:"1px solid rgba(255,255,255,.1)"}}>
          <p style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:10}}>💎 All Incentives Summary</p>
          {[["🏅 Milestone",inr(inc.milestone)],["📈 Performance",inr(inc.performance)],["🏆 Leaderboard",inr(inc.leaderboard)],["💎 Total",inr(inc.total)]].map(([l,v],i,a)=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<a.length-1?"1px solid rgba(255,255,255,.07)":"none"}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,.7)"}}>{l}</span>
              <span style={{fontSize:i===a.length-1?18:14,fontWeight:i===a.length-1?900:700,color:i===a.length-1?"#ffd54f":"rgba(255,255,255,.9)"}}>{v}</span>
            </div>
          ))}
          <p style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:10,textAlign:"center"}}>Budget Cap: ₹2.25 Crore • Never Exceeded</p>
        </div>
      </div>
      <DNNav active="performance" dnav={dnav}/>
    </div>
  );
}


// ═══ ADMIN PANEL ═══════════════════════════════════════════════════════════
function AdminPanel({back}){
  const [auth,setAuth]   = useState(false);
  const [pwd,setPwd]     = useState("");
  const [err,setErr]     = useState("");
  const [tab,setT]       = useState("dash");
  const [search,setSrch] = useState("");
  const [vtab,setVtab]   = useState("all");
  const [notifMsg,setNM] = useState("");
  const [notifTo,setNTo] = useState("all");
  const [notifList,setNL]= useState([]);

  const doLogin=()=>{
    if(pwd===ADMIN_PWD){setAuth(true);setErr("");}
    else setErr("❌ Wrong password. Try: kisan2025");
  };

  if(!auth) return(
    <div style={{background:"#0f172a",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"24px 20px"}}>
      <div className="fi" style={{maxWidth:380,margin:"0 auto",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:52}}>🔐</div>
          <h1 style={{fontSize:24,fontWeight:900,color:"#fff",marginTop:10}}>KisanSetu Admin</h1>
          <p style={{color:"#64748b",fontSize:14,marginTop:4}}>Authorized Access Only</p>
        </div>
        <div style={{background:"#1e293b",borderRadius:16,padding:24}}>
          <label style={{fontSize:13,fontWeight:700,color:"#94a3b8",marginBottom:6,display:"block"}}>🔑 Password</label>
          <input style={{width:"100%",padding:"13px 14px",border:"1.5px solid #334155",borderRadius:10,fontSize:16,background:"#0f172a",color:"#fff",outline:"none",fontFamily:"inherit",textAlign:"center",letterSpacing:4}}
            type="password" placeholder="••••••••" value={pwd}
            onChange={e=>{setPwd(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          {err&&<p style={{color:"#f87171",fontSize:13,marginTop:8,textAlign:"center"}}>{err}</p>}
          <button onClick={doLogin} style={{width:"100%",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",color:"#fff",border:"none",borderRadius:10,padding:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginTop:14}}>🔐 Login</button>
          <p style={{textAlign:"center",fontSize:12,color:"#475569",marginTop:8}}>Demo: kisan2025</p>
          <button onClick={back} style={{width:"100%",background:"none",border:"1px solid #334155",color:"#94a3b8",borderRadius:10,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>← Back</button>
        </div>
      </div>
    </div>
  );

  // ── Data aggregation from live DB ─────────────────────────────────────
  const ul  = Object.entries(DB.users||{});
  const dl  = Object.entries(DB.drivers||{});
  const bkAll = DB.bookings||[];
  const allKhets = Object.entries(DB.khets||{});

  // Village aggregation
  const villageMap = {};
  const addV = (v,key,val=1)=>{if(!v)return;if(!villageMap[v])villageMap[v]={name:v,customers:0,drivers:0,farms:0,acres:0,subAcres:0,bookings:0,revenue:0};villageMap[v][key]+=val;};
  ul.forEach(([ph,u])=>{
    addV(u.village,"customers");
    const khs=DB.khets?.[ph]||[];
    khs.forEach(k=>{addV(u.village,"farms");addV(u.village,"acres",parseFloat(k.acres)||0);});
    if(u.sub) addV(u.village,"subAcres",parseFloat(u.subAcres||u.sA||0));
  });
  dl.forEach(([,d])=>addV(d.village,"drivers"));
  bkAll.forEach(b=>{addV(b.village,"bookings");addV(b.village,"revenue",b.amount||0);});
  const villages = Object.values(villageMap);

  const totalAcres     = allKhets.reduce((s,[,ks])=>s+ks.reduce((a,k)=>a+(parseFloat(k.acres)||0),0),0);
  const totalSubAcres  = ul.filter(([,u])=>u.sub).reduce((s,[,u])=>s+(parseFloat(u.subAcres||u.sA||0)),0);
  const totalRev       = bkAll.reduce((s,b)=>s+(b.amount||0),0);
  const subRev         = ul.filter(([,u])=>u.sub).reduce((s,[,u])=>s+(u.subAmt||0),0);
  const totalFarms     = allKhets.reduce((s,[,ks])=>s+ks.length,0);
  const pending        = bkAll.filter(b=>b.status==="Pending");
  const completed      = bkAll.filter(b=>b.status==="Completed");
  const today          = new Date().toISOString().split("T")[0];
  const todayRev       = bkAll.filter(b=>b.paidAt?.startsWith(today)).reduce((s,b)=>s+(b.amount||0),0);

  // Search filter
  const sq = search.toLowerCase().trim();
  const fUsr = sq ? ul.filter(([ph,u])=>
    (u.name||"").toLowerCase().includes(sq)||ph.includes(sq)||(u.village||"").toLowerCase().includes(sq)
  ) : ul;
  const fDrv = sq ? dl.filter(([ph,d])=>
    (d.name||"").toLowerCase().includes(sq)||ph.includes(sq)||(d.village||"").toLowerCase().includes(sq)||(d.tractorNum||"").toLowerCase().includes(sq)
  ) : dl;
  const fBks = sq ? bkAll.filter(b=>
    b.id?.toLowerCase().includes(sq)||(b.name||"").toLowerCase().includes(sq)||(b.village||"").toLowerCase().includes(sq)||(b.phone||"").includes(sq)
  ) : bkAll;
  const fVil = sq ? villages.filter(v=>v.name.toLowerCase().includes(sq)) : villages;

  const TABS=[
    {k:"dash",  ico:"📊", l:"Dashboard"},
    {k:"fleet", ico:"🚜", l:"Fleet"},
    {k:"vil",   ico:"🏘️", l:"Villages"},
    {k:"cust",  ico:"👥", l:"Customers"},
    {k:"drv",   ico:"👤", l:"Drivers"},
    {k:"farm",  ico:"🌾", l:"Farms"},
    {k:"sub",   ico:"⭐", l:"Subscriptions"},
    {k:"bk",    ico:"📋", l:"Bookings"},
    {k:"rev",   ico:"💰", l:"Revenue"},
    {k:"notif", ico:"🔔", l:"Notify"},
  ];

  const StatCard=({ico,label,value,color,sub})=>(
    <div style={{background:"#1e293b",borderRadius:14,padding:"14px 12px",textAlign:"center",border:"1px solid #334155"}}>
      <div style={{fontSize:22,marginBottom:4}}>{ico}</div>
      <p style={{color:color||"#fff",fontWeight:900,fontSize:20}}>{value}</p>
      <p style={{color:"#64748b",fontSize:10,fontWeight:600,marginTop:2,lineHeight:1.2}}>{label}</p>
      {sub&&<p style={{color:"#475569",fontSize:9,marginTop:2}}>{sub}</p>}
    </div>
  );

  const Row=({children,border=true})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:border?"1px solid #1e293b":"none"}}>{children}</div>
  );

  const Badge=({txt,color="#3b82f6",bg})=>(
    <span style={{background:bg||color+"22",color,padding:"2px 8px",borderRadius:999,fontSize:10,fontWeight:800}}>{txt}</span>
  );

  const ActionBtn=({label,color,onClick})=>(
    <button onClick={onClick} style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:11}}>{label}</button>
  );

  return(
    <div style={{background:"#0f172a",minHeight:"100vh",color:"#fff",fontFamily:"'Segoe UI',sans-serif"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1e3a5f,#1e293b)",padding:"40px 16px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #334155"}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:2}}>📊 KisanSetu Admin</h1>
          <p style={{fontSize:11,color:"#64748b"}}>Full Control Dashboard</p>
        </div>
        <button onClick={()=>setAuth(false)} style={{background:"#334155",border:"none",color:"#94a3b8",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>Logout</button>
      </div>

      {/* Universal Search */}
      <div style={{padding:"12px 14px",background:"#1e293b",borderBottom:"1px solid #334155"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#475569"}}>🔍</span>
          <input style={{width:"100%",padding:"10px 14px 10px 34px",background:"#0f172a",border:"1.5px solid #334155",borderRadius:10,color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}
            placeholder="Search customer, driver, village, booking ID..." value={search} onChange={e=>setSrch(e.target.value)}/>
          {search&&<button onClick={()=>setSrch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:16}}>✕</button>}
        </div>
        {search&&<p style={{fontSize:11,color:"#64748b",marginTop:6}}>Results: {fUsr.length} customers • {fDrv.length} drivers • {fBks.length} bookings • {fVil.length} villages</p>}
      </div>

      {/* Tab nav */}
      <div style={{overflowX:"auto",background:"#1e293b",borderBottom:"1px solid #334155",display:"flex",whiteSpace:"nowrap",WebkitOverflowScrolling:"touch"}}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>setT(t.k)} style={{padding:"10px 12px",background:tab===t.k?"#3b82f6":"transparent",color:tab===t.k?"#fff":"#64748b",border:"none",cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"inherit",flexShrink:0,whiteSpace:"nowrap"}}>
            {t.ico} {t.l}
          </button>
        ))}
      </div>

      <div style={{padding:"13px 13px 30px"}}>

        {/* ── DASHBOARD ── */}
        {tab==="dash"&&<>
          {/* Stats grid */}
          <p style={{fontSize:12,color:"#64748b",marginBottom:8,fontWeight:600}}>OVERVIEW</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:14}}>
            <StatCard ico="🏘️" label="Villages"     value={villages.length}                          color="#60a5fa"/>
            <StatCard ico="👥" label="Customers"    value={ul.length}                                color="#34d399"/>
            <StatCard ico="🚜" label="Drivers"      value={dl.length}                                color="#f59e0b"/>
            <StatCard ico="🌾" label="Total Farms"  value={totalFarms}                               color="#a78bfa"/>
            <StatCard ico="📐" label="Reg. Acres"   value={`${totalAcres.toFixed(1)} Ac`}            color="#f472b6"/>
            <StatCard ico="⭐" label="Sub. Acres"   value={`${totalSubAcres.toFixed(1)} Ac`}         color="#fbbf24"/>
            <StatCard ico="📋" label="Bookings"     value={bkAll.length}                             color="#60a5fa"/>
            <StatCard ico="⏳" label="Pending"      value={pending.length}                           color="#fb923c"/>
            <StatCard ico="✅" label="Completed"    value={completed.length}                         color="#34d399"/>
            <StatCard ico="💰" label="Total Rev."   value={`₹${totalRev.toLocaleString("en-IN")}`}   color="#34d399"/>
            <StatCard ico="📅" label="Today Rev."   value={`₹${todayRev.toLocaleString("en-IN")}`}   color="#60a5fa"/>
            <StatCard ico="⭐" label="Sub. Rev."    value={`₹${subRev.toLocaleString("en-IN")}`}     color="#a78bfa"/>
          </div>
          {/* Service breakdown */}
          <div style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #334155"}}>
            <p style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:10}}>🛠️ Service-wise Bookings</p>
            {SVC.map(s=>{
              const cnt=bkAll.filter(b=>b.serviceId===s.id).length;
              const rev2=bkAll.filter(b=>b.serviceId===s.id).reduce((a,b)=>a+(b.amount||0),0);
              const pct=bkAll.length?Math.round((cnt/bkAll.length)*100):0;
              return(
                <div key={s.id} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:"#e2e8f0"}}>{s.ico} {s.n}</span>
                    <span style={{fontSize:12,color:"#34d399",fontWeight:700}}>₹{rev2.toLocaleString("en-IN")} ({cnt})</span>
                  </div>
                  <div style={{background:"#0f172a",borderRadius:999,height:6,overflow:"hidden"}}>
                    <div style={{height:"100%",background:"#3b82f6",borderRadius:999,width:`${pct}%`}}/>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Recent bookings */}
          <div style={{background:"#1e293b",borderRadius:14,padding:14,border:"1px solid #334155"}}>
            <p style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:10}}>📋 Recent Bookings</p>
            {[...bkAll].reverse().slice(0,5).map(b=>(
              <div key={b.id} style={{padding:"9px 0",borderBottom:"1px solid #0f172a"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{b.icon} {b.serviceNameHi}</p>
                    <p style={{fontSize:11,color:"#64748b"}}>{b.name} • {b.village} • {fd(b.date)}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:13,fontWeight:800,color:"#34d399"}}>₹{b.amount}</p>
                    <Badge txt={b.status} color={b.status==="Completed"?"#34d399":b.status==="Ongoing"?"#f59e0b":"#60a5fa"}/>
                  </div>
                </div>
              </div>
            ))}
            {bkAll.length===0&&<p style={{color:"#475569",fontSize:13,textAlign:"center",padding:"16px 0"}}>No bookings yet</p>}
          </div>
        </>}

        {/* ── VILLAGE ANALYTICS ── */}
        {tab==="vil"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            <StatCard ico="🏘️" label="Villages"  value={villages.length}              color="#60a5fa"/>
            <StatCard ico="👥" label="Customers" value={ul.length}                    color="#34d399"/>
            <StatCard ico="📐" label="Acres"     value={totalAcres.toFixed(0)}        color="#f59e0b"/>
          </div>
          {/* Village table */}
          {(search?fVil:villages).sort((a,b)=>b.revenue-a.revenue).map(v=>(
            <div key={v.name} style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:8,border:"1px solid #334155"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <p style={{fontWeight:800,fontSize:15,color:"#fff"}}>🏘️ {v.name}</p>
                  <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                    <Badge txt={`👥 ${v.customers}`} color="#60a5fa"/>
                    <Badge txt={`🚜 ${v.drivers}`}   color="#f59e0b"/>
                    <Badge txt={`🌾 ${v.farms} farms`} color="#a78bfa"/>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{fontSize:16,fontWeight:900,color:"#34d399"}}>₹{v.revenue.toLocaleString("en-IN")}</p>
                  <p style={{fontSize:10,color:"#64748b"}}>revenue</p>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                {[["📐 Reg. Ac",`${v.acres.toFixed(1)}`,"#f472b6"],["⭐ Sub Ac",`${v.subAcres.toFixed(1)}`,"#fbbf24"],["📋 Bookings",v.bookings,"#60a5fa"]].map(([l,val,c])=>(
                  <div key={l} style={{background:"#0f172a",borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                    <p style={{fontSize:10,color:"#64748b",marginBottom:2}}>{l}</p>
                    <p style={{fontSize:14,fontWeight:900,color:c}}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {villages.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#475569"}}><p style={{fontSize:36}}>🏘️</p><p style={{fontSize:14,marginTop:10}}>No village data yet</p></div>}
        </>}


        {/* ══ FLEET MANAGEMENT TAB ══ */}
        {tab==="fleet"&&(()=>{
          syncFleet();
          const fs = fleetSummary();
          const vwl = villageWorkload();
          const tractors = Object.values(DB.fleet);
          const TARGET = 500; // soft target — NOT a hard limit

          const capLabel = (acres) => {
            if(acres >= 600) return {l:"🔴 High Demand",  c:"#ef4444", bg:"#fef2f2"};
            if(acres >= 500) return {l:"🟠 Expansion Rec",c:"#f59e0b", bg:"#fffbeb"};
            if(acres >= 400) return {l:"🟡 Warning",       c:"#eab308", bg:"#fefce8"};
            return             {l:"🟢 Normal",             c:"#22c55e", bg:"#f0fdf4"};
          };

          return(<>
            {/* Fleet KPI row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              {[
                {ico:"🚜",l:"Total",    v:fs.total,     c:"#60a5fa"},
                {ico:"✅",l:"Available",v:fs.available, c:"#4ade80"},
                {ico:"🔄",l:"Busy",     v:fs.busy,      c:"#fbbf24"},
                {ico:"🔧",l:"Maintnc.", v:fs.maintenance,c:"#f472b6"},
                {ico:"💥",l:"Breakdown",v:fs.breakdown,  c:"#f87171"},
                {ico:"⏳",l:"Waiting",  v:fs.waiting,    c:"#a78bfa"},
              ].map(s=>(
                <div key={s.l} style={{background:"#1e293b",borderRadius:12,padding:"10px 8px",textAlign:"center",border:"1px solid #334155"}}>
                  <p style={{fontSize:16,margin:"0 0 3px"}}>{s.ico}</p>
                  <p style={{color:s.c,fontWeight:900,fontSize:17,margin:0}}>{s.v}</p>
                  <p style={{color:"#64748b",fontSize:9,fontWeight:600,margin:0}}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Capacity utilisation bar */}
            <div style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:12,border:"1px solid #334155"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <p style={{color:"#e2e8f0",fontSize:13,fontWeight:700,margin:0}}>⚙️ Fleet Capacity Utilisation</p>
                <p style={{color:"#fbbf24",fontSize:13,fontWeight:800,margin:0}}>{fs.utilPct}%</p>
              </div>
              <div style={{background:"#0f172a",borderRadius:999,height:10,overflow:"hidden",marginBottom:6}}>
                <div style={{height:"100%",background:fs.utilPct>80?"#ef4444":fs.utilPct>60?"#f59e0b":"#22c55e",borderRadius:999,width:`${Math.min(fs.utilPct,100)}%`,transition:"width .5s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <p style={{color:"#64748b",fontSize:11,margin:0}}>Used: {fs.usedCap} Ac</p>
                <p style={{color:"#64748b",fontSize:11,margin:0}}>Free: {fs.freeCap} Ac</p>
                <p style={{color:"#64748b",fontSize:11,margin:0}}>Total: {fs.totalCap} Ac/day</p>
              </div>
            </div>

            {/* High demand alerts */}
            {tractors.filter(t=>t.pendingAcres>=TARGET).map(t=>(
              <div key={t.id} style={{background:"linear-gradient(135deg,#7f1d1d,#b91c1c)",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #ef4444"}}>
                <p style={{color:"#fca5a5",fontSize:11,fontWeight:700,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>⚠️ High Demand Alert</p>
                <p style={{color:"#fff",fontSize:14,fontWeight:800,margin:"0 0 4px"}}>{t.tractorNum} — {t.village}</p>
                <p style={{color:"rgba(255,255,255,.75)",fontSize:12,margin:"0 0 8px"}}>
                  Driver: {t.driverName} · {t.pendingAcres} Acres assigned (Target: {TARGET})
                </p>
                <p style={{color:"#fbbf24",fontSize:12,fontWeight:700,margin:0}}>
                  💡 Consider adding a second tractor in {t.village} village.
                </p>
              </div>
            ))}

            {/* Waiting list alert */}
            {DB.waitList.length>0&&(
              <div style={{background:"linear-gradient(135deg,#312e81,#4338ca)",borderRadius:14,padding:14,marginBottom:12,border:"1px solid #6366f1"}}>
                <p style={{color:"#c7d2fe",fontSize:11,fontWeight:700,margin:"0 0 4px"}}>⏳ WAITING LIST</p>
                <p style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 4px"}}>{DB.waitList.length} Booking{DB.waitList.length!==1?"s":""} waiting for a tractor</p>
                <p style={{color:"rgba(255,255,255,.65)",fontSize:12,margin:"0 0 10px"}}>Will auto-assign when capacity is available.</p>
                <button onClick={()=>processWaitList()} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",color:"#fff",borderRadius:9,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:12}}>
                  ▶ Process Wait List Now
                </button>
              </div>
            )}

            {/* Tractor cards */}
            <p style={{color:"#94a3b8",fontSize:11,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:.8}}>
              All Tractors ({tractors.length})
            </p>
            {tractors.length===0&&(
              <div style={{textAlign:"center",padding:"40px 0",color:"#475569"}}>
                <p style={{fontSize:40}}>🚜</p>
                <p style={{fontSize:14,marginTop:10}}>No tractors registered yet.</p>
                <p style={{fontSize:12,marginTop:4}}>Tractors appear here when drivers register.</p>
              </div>
            )}
            {tractors.map(t=>{
              const cap = capLabel(t.pendingAcres);
              const pct = Math.min((t.pendingAcres/TARGET)*100,100);
              const isDrv = DB.drivers[t.driverPhone];
              return(
                <div key={t.id} style={{background:"#1e293b",borderRadius:16,padding:16,marginBottom:10,border:"1px solid #334155"}}>
                  {/* Tractor header */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <p style={{color:"#f1f5f9",fontSize:15,fontWeight:800,margin:"0 0 3px"}}>🚜 {t.tractorNum}</p>
                      <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 2px"}}>👤 {t.driverName} · 🏘️ {t.village}</p>
                      <p style={{color:"#64748b",fontSize:11,margin:0}}>⚡ {t.dailyCapacity} Ac/day capacity</p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <span style={{background:cap.bg,color:cap.c,padding:"3px 10px",borderRadius:999,fontSize:10,fontWeight:800,border:`1px solid ${cap.c}44`,display:"block",marginBottom:5}}>{cap.l}</span>
                      <span style={{background:t.status==="Available"?"#14532d":t.status==="Busy"?"#713f12":t.status==="Breakdown"?"#7f1d1d":"#1e3a5f",color:"#fff",padding:"2px 8px",borderRadius:999,fontSize:10,fontWeight:700,display:"block"}}>{t.status}</span>
                    </div>
                  </div>

                  {/* Acre stats */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:10}}>
                    {[
                      {l:"Target",   v:`${TARGET} Ac`,         c:"#94a3b8"},
                      {l:"Assigned", v:`${t.pendingAcres} Ac`, c:"#fbbf24"},
                      {l:"Completed",v:`${t.completedAcres} Ac`,c:"#4ade80"},
                    ].map(s=>(
                      <div key={s.l} style={{background:"#0f172a",borderRadius:10,padding:"9px 7px",textAlign:"center"}}>
                        <p style={{fontSize:13,fontWeight:900,color:s.c,margin:"0 0 2px"}}>{s.v}</p>
                        <p style={{fontSize:9,color:"#475569",fontWeight:600,margin:0,textTransform:"uppercase"}}>{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Capacity bar */}
                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <p style={{color:"#94a3b8",fontSize:11,margin:0}}>Capacity Usage vs Target (500 Ac)</p>
                      <p style={{color:cap.c,fontSize:11,fontWeight:700,margin:0}}>{t.pendingAcres}/{TARGET}</p>
                    </div>
                    <div style={{background:"#0f172a",borderRadius:999,height:8,overflow:"hidden"}}>
                      <div style={{height:"100%",background:cap.c,borderRadius:999,width:`${pct}%`,transition:"width .5s"}}/>
                    </div>
                    {t.pendingAcres>TARGET&&<p style={{color:cap.c,fontSize:10,fontWeight:700,marginTop:4}}>
                      ⚡ {t.pendingAcres-TARGET} Ac over target — Booking continues (no hard limit)
                    </p>}
                  </div>

                  {/* Jobs info */}
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                    <span style={{background:"rgba(251,191,36,.1)",color:"#fbbf24",border:"1px solid rgba(251,191,36,.2)",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>
                      📋 {t.assignedJobs.length} Active Jobs
                    </span>
                    <span style={{background:"rgba(74,222,128,.1)",color:"#4ade80",border:"1px solid rgba(74,222,128,.2)",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>
                      ✅ {t.completedJobs} Completed
                    </span>
                    {isDrv&&<span style={{background:isDrv.approved?"rgba(34,197,94,.1)":"rgba(251,191,36,.1)",color:isDrv.approved?"#22c55e":"#fbbf24",border:"1px solid currentColor",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>
                      {isDrv.approved?"✅ Approved":"⏳ Pending"}
                    </span>}
                  </div>

                  {/* Admin Actions */}
                  <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                    {t.status!==TRACTOR_STATUS.BREAKDOWN&&(
                      <button onClick={()=>{ handleBreakdown(t.id,"Admin marked breakdown"); setT("fleet"); }}
                        style={{background:"rgba(239,68,68,.15)",color:"#f87171",border:"1px solid rgba(239,68,68,.3)",borderRadius:9,padding:"6px 12px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:11}}>
                        💥 Mark Breakdown
                      </button>
                    )}
                    {t.status===TRACTOR_STATUS.BREAKDOWN&&(
                      <button onClick={()=>{ if(DB.fleet[t.id]) DB.fleet[t.id].status=TRACTOR_STATUS.AVAILABLE; processWaitList(); setT("fleet"); }}
                        style={{background:"rgba(34,197,94,.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,.3)",borderRadius:9,padding:"6px 12px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:11}}>
                        ✅ Mark Available
                      </button>
                    )}
                    {t.status===TRACTOR_STATUS.AVAILABLE&&(
                      <button onClick={()=>{ if(DB.fleet[t.id]) DB.fleet[t.id].status=TRACTOR_STATUS.MAINTENANCE; setT("fleet"); }}
                        style={{background:"rgba(251,191,36,.15)",color:"#fbbf24",border:"1px solid rgba(251,191,36,.3)",borderRadius:9,padding:"6px 12px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:11}}>
                        🔧 Maintenance
                      </button>
                    )}
                    <button onClick={()=>{ if(DB.fleet[t.id]) DB.fleet[t.id].dailyCapacity=Math.min((DB.fleet[t.id].dailyCapacity||20)+5,100); setT("fleet"); }}
                      style={{background:"rgba(96,165,250,.15)",color:"#60a5fa",border:"1px solid rgba(96,165,250,.3)",borderRadius:9,padding:"6px 12px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:11}}>
                      ⬆ +5 Ac/day Cap
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Village workload table */}
            {Object.keys(vwl).length>0&&(
              <div style={{background:"#1e293b",borderRadius:14,padding:14,marginTop:6,border:"1px solid #334155"}}>
                <p style={{color:"#e2e8f0",fontSize:13,fontWeight:800,margin:"0 0 12px"}}>🏘️ Village-wise Fleet Load</p>
                {Object.entries(vwl).sort((a,b)=>b[1].pendingAc-a[1].pendingAc).map(([vil,w])=>(
                  <div key={vil} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #0f172a",alignItems:"center"}}>
                    <div>
                      <p style={{color:"#f1f5f9",fontSize:13,fontWeight:700,margin:"0 0 2px"}}>{vil}</p>
                      <p style={{color:"#64748b",fontSize:10,margin:0}}>{w.tractors} tractor{w.tractors!==1?"s":""}</p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <p style={{color:"#fbbf24",fontSize:13,fontWeight:800,margin:"0 0 1px"}}>{w.pendingAc} Ac pending</p>
                      <p style={{color:"#4ade80",fontSize:11,margin:0}}>{w.completedAc} Ac done</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Transfer history */}
            {DB.transfers.length>0&&(
              <div style={{background:"#1e293b",borderRadius:14,padding:14,marginTop:10,border:"1px solid #334155"}}>
                <p style={{color:"#e2e8f0",fontSize:13,fontWeight:800,margin:"0 0 12px"}}>🔁 Transfer History ({DB.transfers.length})</p>
                {DB.transfers.slice(-5).reverse().map((tr,i)=>(
                  <div key={i} style={{padding:"9px 0",borderBottom:"1px solid #0f172a"}}>
                    <p style={{color:"#f1f5f9",fontSize:12,fontWeight:700,margin:"0 0 3px"}}>#{tr.id} · {tr.reason}</p>
                    <p style={{color:"#94a3b8",fontSize:11,margin:"0 0 2px"}}>From: {tr.fromTractor} ({tr.fromDriver})</p>
                    <p style={{color:"#4ade80",fontSize:11,margin:"0 0 2px"}}>To: {tr.toTractor} ({tr.toDriver})</p>
                    <p style={{color:"#475569",fontSize:10,margin:0}}>{new Date(tr.transferredAt).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            )}
          </>);
        })()}

        {/* ── CUSTOMERS ── */}
        {tab==="cust"&&<>
          <p style={{fontSize:12,color:"#64748b",marginBottom:10,fontWeight:600}}>{fUsr.length} CUSTOMERS{search&&` matching "${search}"`}</p>
          {fUsr.map(([ph,u])=>{
            const ks=DB.khets?.[ph]||[];
            const ubks=bkAll.filter(b=>b.ph===ph);
            const totalAc2=ks.reduce((s,k)=>s+(parseFloat(k.acres)||0),0);
            return(
              <div key={ph} style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:8,border:"1px solid #334155"}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#fff",flexShrink:0}}>
                    {(u.name?.[0]||"?").toUpperCase()}
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:800,fontSize:14,color:"#fff"}}>{u.name||"—"}</p>
                    <p style={{fontSize:12,color:"#64748b",marginTop:2}}>📱 {ph} • 🏘️ {u.village||"—"}</p>
                    <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                      <Badge txt={`🌾 ${ks.length} farms`}  color="#a78bfa"/>
                      <Badge txt={`📐 ${totalAc2.toFixed(1)} Ac`} color="#f472b6"/>
                      <Badge txt={`📋 ${ubks.length} bkgs`} color="#60a5fa"/>
                      {u.sub?<Badge txt="⭐ Sub Active" color="#34d399"/>:<Badge txt="No Sub" color="#f87171"/>}
                      {u.aadDone&&<Badge txt="✅ Aadhaar" color="#34d399"/>}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:7,marginTop:10}}>
                  <ActionBtn label={u.blocked?"🔓 Unblock":"🔒 Block"} color={u.blocked?"#34d399":"#f87171"} onClick={()=>{const u2=DB.users[ph];if(u2)u2.blocked=!u2.blocked;}}/>
                  <ActionBtn label="🗑️ Delete" color="#ef4444" onClick={()=>{delete DB.users[ph];}}/>
                </div>
                {/* Farms */}
                {ks.length>0&&<div style={{marginTop:10,borderTop:"1px solid #334155",paddingTop:10}}>
                  <p style={{fontSize:11,color:"#64748b",marginBottom:6}}>🌾 FARMS:</p>
                  {ks.map((k,ki)=>(
                    <div key={ki} style={{background:"#0f172a",borderRadius:8,padding:"8px 10px",marginBottom:5}}>
                      <p style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{k.name} — {k.acres} Ac</p>
                      <p style={{fontSize:11,color:"#64748b"}}>📍 {k.village||"—"} • 📜 {k.sat712?.length||0} 7/12 docs</p>
                    </div>
                  ))}
                </div>}
              </div>
            );
          })}
          {fUsr.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#475569"}}><p style={{fontSize:36}}>👥</p><p style={{fontSize:14,marginTop:10}}>No customers{search?" found":""}</p></div>}
        </>}

        {/* ── DRIVERS ── */}
        {tab==="drv"&&<>
          <p style={{fontSize:12,color:"#64748b",marginBottom:10,fontWeight:600}}>{fDrv.length} DRIVERS{search&&` matching "${search}"`}</p>
          {fDrv.map(([ph,d])=>{
            const dBks=bkAll.filter(b=>b.driverId===ph);
            const done=dBks.filter(b=>b.status==="Completed");
            const totalAcPool=DEMO_DRIVERS.reduce((s,x)=>s+x.ac,0)+(d.acresCompleted||0)||1;
            const inc=Math.round(((d.acresCompleted||0)/totalAcPool)*POOL_MILESTONE);
            return(
              <div key={ph} style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:8,border:"1px solid #334155"}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#fff",flexShrink:0}}>
                    {(d.name?.[0]||"D").toUpperCase()}
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:800,fontSize:14,color:"#fff"}}>{d.name||"—"}</p>
                    <p style={{fontSize:12,color:"#64748b",marginTop:2}}>📱 {ph} • 🏘️ {d.village||"—"}</p>
                    <p style={{fontSize:12,color:"#64748b"}}>🚜 {d.tractorNum||"—"} {d.tractorDet?`• ${d.tractorDet}`:""}</p>
                    <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                      {d.approved?<Badge txt="✅ Approved" color="#34d399"/>:<Badge txt="⏳ Pending" color="#f59e0b"/>}
                      {d.blocked&&<Badge txt="🔒 Blocked" color="#f87171"/>}
                      <Badge txt={`⭐ ${(d.rating||5).toFixed(1)}`}     color="#fbbf24"/>
                      <Badge txt={`🌾 ${d.acresCompleted||0} Ac`}        color="#60a5fa"/>
                      <Badge txt={`✅ ${done.length} jobs`}              color="#34d399"/>
                      <Badge txt={`💰 ₹${inc.toLocaleString("en-IN")} est.`} color="#a78bfa"/>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>
                  <ActionBtn label={d.approved?"🚫 Suspend":"✅ Approve"} color={d.approved?"#f87171":"#34d399"} onClick={()=>{const d2=DB.drivers[ph];if(d2)d2.approved=!d2.approved;}}/>
                  <ActionBtn label={d.blocked?"🔓 Unblock":"🔒 Block"}   color={d.blocked?"#34d399":"#f87171"} onClick={()=>{const d2=DB.drivers[ph];if(d2)d2.blocked=!d2.blocked;}}/>
                  <ActionBtn label="🗑️ Delete" color="#ef4444" onClick={()=>{delete DB.drivers[ph];}}/>
                </div>
              </div>
            );
          })}
          {fDrv.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#475569"}}><p style={{fontSize:36}}>🚜</p><p style={{fontSize:14,marginTop:10}}>No drivers{search?" found":""}</p></div>}
        </>}

        {/* ── FARMS ── */}
        {tab==="farm"&&<>
          <p style={{fontSize:12,color:"#64748b",marginBottom:10,fontWeight:600}}>ALL FARMS ({totalFarms})</p>
          {allKhets.flatMap(([ph,ks])=>ks.map((k,ki)=>({...k,ownerPhone:ph,ownerName:DB.users[ph]?.name||ph,ownerVil:DB.users[ph]?.village||"—"}))).filter(k=>!sq||(k.name.toLowerCase().includes(sq)||k.ownerName.toLowerCase().includes(sq)||k.village?.toLowerCase().includes(sq)||k.ownerVil.toLowerCase().includes(sq))).map((k,i)=>(
            <div key={i} style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:8,border:"1px solid #334155"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <p style={{fontWeight:800,fontSize:14,color:"#fff"}}>🌾 {k.name}</p>
                  <p style={{fontSize:12,color:"#64748b",marginTop:2}}>👤 {k.ownerName} • 📱 {k.ownerPhone}</p>
                  <p style={{fontSize:12,color:"#64748b"}}>📍 {k.village||k.ownerVil||"—"} • 📐 {k.acres} Acre</p>
                  <p style={{fontSize:11,color:"#64748b",marginTop:2}}>📜 {k.sat712?.length||0} 7/12 document(s)</p>
                  {k.sat712&&k.sat712.length>0&&k.sat712.map((d,di)=>(
                    <div key={di} style={{background:"#0f172a",borderRadius:7,padding:"6px 10px",marginTop:5}}>
                      <p style={{fontSize:11,color:"#34d399",fontWeight:700}}>✅ 7/12 #{di+1} — {d.label}</p>
                      <p style={{fontSize:10,color:"#475569"}}>📍 {d.village||"—"} • 🌾 {d.acres||"—"} Ac • {d.src} • {d.uploadedAt?new Date(d.uploadedAt).toLocaleDateString("en-IN"):""}</p>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                  <Badge txt={k.sat712?.length>0?"✅ Docs OK":"⚠️ No Docs"} color={k.sat712?.length>0?"#34d399":"#f87171"}/>
                </div>
              </div>
            </div>
          ))}
          {totalFarms===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#475569"}}><p style={{fontSize:36}}>🌾</p><p style={{fontSize:14,marginTop:10}}>No farms registered yet</p></div>}
        </>}

        {/* ── SUBSCRIPTIONS ── */}
        {tab==="sub"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:14}}>
            <StatCard ico="⭐" label="Active Subs"   value={ul.filter(([,u])=>u.sub).length}            color="#34d399"/>
            <StatCard ico="📐" label="Sub. Acres"    value={`${totalSubAcres.toFixed(1)} Ac`}           color="#fbbf24"/>
            <StatCard ico="💰" label="Sub. Revenue"  value={`₹${subRev.toLocaleString("en-IN")}`}        color="#a78bfa"/>
            <StatCard ico="📅" label="No Sub"        value={ul.filter(([,u])=>!u.sub).length}           color="#f87171"/>
          </div>
          {ul.filter(([,u])=>u.sub).map(([ph,u])=>{
            const ks=DB.khets?.[ph]||[];
            const subFarms=u.subFarms||[];
            const subAc2=parseFloat(u.subAcres||u.sA||0);
            return(
              <div key={ph} style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:8,border:"1px solid #334155"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <p style={{fontWeight:800,fontSize:14,color:"#fff"}}>{u.name}</p>
                    <p style={{fontSize:12,color:"#64748b"}}>📱 {ph} • 🏘️ {u.village||"—"}</p>
                    <p style={{fontSize:12,color:"#64748b",marginTop:2}}>📐 {subAc2} Acres subscribed</p>
                    <p style={{fontSize:12,color:"#64748b"}}>📅 Since: {u.subDate?new Date(u.subDate).toLocaleDateString("en-IN"):"—"}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:18,fontWeight:900,color:"#34d399"}}>₹{u.subAmt||0}</p>
                    <Badge txt="⭐ Active" color="#34d399"/>
                  </div>
                </div>
                {/* Selected farms for this subscription */}
                {subFarms.length>0&&<div style={{borderTop:"1px solid #334155",paddingTop:8}}>
                  <p style={{fontSize:11,color:"#64748b",marginBottom:6}}>SUBSCRIBED FARMS:</p>
                  {subFarms.map((f,fi)=>(
                    <div key={fi} style={{background:"#0f172a",borderRadius:7,padding:"6px 10px",marginBottom:4}}>
                      <p style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{f.label||f.khetName||"Farm"}</p>
                      <p style={{fontSize:11,color:"#64748b"}}>📍 {f.village||"—"} • 🌾 {f.acres||"—"} Ac</p>
                    </div>
                  ))}
                </div>}
              </div>
            );
          })}
          {ul.filter(([,u])=>u.sub).length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#475569"}}><p style={{fontSize:36}}>⭐</p><p style={{fontSize:14,marginTop:10}}>No active subscriptions yet</p></div>}
        </>}

        {/* ── BOOKINGS ── */}
        {tab==="bk"&&<>
          <p style={{fontSize:12,color:"#64748b",marginBottom:10,fontWeight:600}}>{fBks.length} BOOKINGS{search&&` matching "${search}"`}</p>
          {[...fBks].reverse().map(b=>(
            <div key={b.id} style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:8,border:"1px solid #334155"}}>
              <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                <Badge txt={b.status} color={b.status==="Completed"?"#34d399":b.status==="Ongoing"?"#f59e0b":b.status==="Cancelled"?"#f87171":"#60a5fa"}/>
                {b.payment_status==="paid"&&<Badge txt="💳 PAID" color="#34d399"/>}
                <Badge txt={`#${b.id}`} color="#64748b"/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{flex:1}}>
                  <p style={{fontWeight:800,fontSize:14,color:"#fff"}}>{b.icon} {b.serviceNameHi}</p>
                  <p style={{fontSize:12,color:"#64748b",marginTop:2}}>👤 {b.name} • 📱 {b.phone||"—"}</p>
                  <p style={{fontSize:12,color:"#64748b"}}>🏘️ {b.village} • 🌾 {b.acres} Ac • 📅 {fd(b.date)}</p>
                  {b.khetName&&<p style={{fontSize:12,color:"#64748b"}}>🌾 Farm: {b.khetName} {b.khetVillage?`• 📍 ${b.khetVillage}`:""}</p>}
                  {b.sat712Label&&<p style={{fontSize:11,color:"#94a3b8"}}>📜 {b.sat712Label}</p>}
                  {b.driverId&&<p style={{fontSize:12,color:"#f59e0b"}}>🚜 Driver: {DB.drivers[b.driverId]?.name||b.driverId}</p>}
                  {/* OTP tracking */}
                  <p style={{fontSize:11,color:"#64748b",marginTop:4}}>
                    🔑 OTP: <span style={{color:"#fbbf24",fontWeight:700}}>1234</span>
                    {b.status==="Completed"?<span style={{color:"#34d399",marginLeft:6}}>✅ Verified</span>:<span style={{color:"#f87171",marginLeft:6}}>⏳ Pending</span>}
                  </p>
                  {b.startedAt&&<p style={{fontSize:11,color:"#64748b"}}>▶ Started: {ft(b.startedAt)}</p>}
                  {b.completedAt&&<p style={{fontSize:11,color:"#64748b"}}>✅ Done: {ft(b.completedAt)}</p>}
                  {b.startGps&&<p style={{fontSize:10,color:"#475569"}}>📍 Start GPS: {b.startGps.lat.toFixed(4)},{b.startGps.lng.toFixed(4)}</p>}
                  {b.endGps&&<p style={{fontSize:10,color:"#475569"}}>📍 End GPS: {b.endGps.lat.toFixed(4)},{b.endGps.lng.toFixed(4)}</p>}
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                  <p style={{fontSize:16,fontWeight:900,color:"#34d399"}}>₹{b.amount}</p>
                  <p style={{fontSize:10,color:"#64748b",marginTop:2}}>{b.payMethod||"—"}</p>
                </div>
              </div>
              {/* Assign driver */}
              {b.status==="Pending"&&<div style={{marginTop:8,paddingTop:8,borderTop:"1px solid #334155"}}>
                <p style={{fontSize:11,color:"#64748b",marginBottom:6}}>Assign Driver:</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {dl.filter(([,d])=>d.approved&&!d.blocked&&d.village===b.village).slice(0,3).map(([ph,d])=>(
                    <button key={ph} onClick={()=>{const idx=DB.bookings.findIndex(x=>x.id===b.id);if(idx>=0){DB.bookings[idx].driverId=ph;DB.bookings[idx].status="Accepted";}}}
                      style={{background:"#1e3a5f",color:"#60a5fa",border:"1px solid #3b82f6",borderRadius:7,padding:"5px 9px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:11}}>
                      🚜 {d.name}
                    </button>
                  ))}
                  <ActionBtn label="❌ Cancel" color="#f87171" onClick={()=>{const idx=DB.bookings.findIndex(x=>x.id===b.id);if(idx>=0)DB.bookings[idx].status="Cancelled";}}/>
                </div>
              </div>}
            </div>
          ))}
          {fBks.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#475569"}}><p style={{fontSize:36}}>📋</p><p style={{fontSize:14,marginTop:10}}>No bookings{search?" found":""}</p></div>}
        </>}

        {/* ── REVENUE ── */}
        {tab==="rev"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:14}}>
            <StatCard ico="💰" label="Total Revenue"  value={`₹${totalRev.toLocaleString("en-IN")}`}  color="#34d399"/>
            <StatCard ico="⭐" label="Sub Revenue"    value={`₹${subRev.toLocaleString("en-IN")}`}   color="#fbbf24"/>
            <StatCard ico="📅" label="Today"          value={`₹${todayRev.toLocaleString("en-IN")}`} color="#60a5fa"/>
            <StatCard ico="💳" label="Paid Bookings"  value={bkAll.filter(b=>b.payment_status==="paid").length} color="#a78bfa"/>
          </div>
          {/* Village revenue */}
          <div style={{background:"#1e293b",borderRadius:14,padding:14,marginBottom:12,border:"1px solid #334155"}}>
            <p style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:10}}>🏘️ Village-wise Revenue</p>
            {villages.sort((a,b2)=>b2.revenue-a.revenue).map((v,i)=>(
              <div key={v.name} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #0f172a",alignItems:"center"}}>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>#{i+1} {v.name}</p>
                  <p style={{fontSize:11,color:"#64748b"}}>{v.bookings} bookings • {v.customers} customers</p>
                </div>
                <p style={{fontSize:14,fontWeight:900,color:"#34d399"}}>₹{v.revenue.toLocaleString("en-IN")}</p>
              </div>
            ))}
            {villages.length===0&&<p style={{color:"#475569",fontSize:13,textAlign:"center",padding:"16px 0"}}>No revenue data yet</p>}
          </div>
          {/* Service revenue */}
          <div style={{background:"#1e293b",borderRadius:14,padding:14,border:"1px solid #334155"}}>
            <p style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:10}}>🛠️ Service-wise Revenue</p>
            {SVC.map(s=>{
              const rev2=bkAll.filter(b=>b.serviceId===s.id).reduce((a,b)=>a+(b.amount||0),0);
              const cnt=bkAll.filter(b=>b.serviceId===s.id).length;
              return(
                <div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #0f172a",alignItems:"center"}}>
                  <p style={{fontSize:13,color:"#e2e8f0"}}>{s.ico} {s.n}</p>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:13,fontWeight:800,color:"#34d399"}}>₹{rev2.toLocaleString("en-IN")}</p>
                    <p style={{fontSize:10,color:"#64748b"}}>{cnt} bookings</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ── NOTIFICATIONS ── */}
        {tab==="notif"&&<>
          <div style={{background:"#1e293b",borderRadius:14,padding:16,marginBottom:12,border:"1px solid #334155"}}>
            <p style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:12}}>🔔 Send Notification</p>
            <label style={{fontSize:12,fontWeight:700,color:"#94a3b8",marginBottom:6,display:"block"}}>Send To</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
              {[["all","🌍 All"],["customers","👥 Customers"],["drivers","🚜 Drivers"]].map(([v,l])=>(
                <button key={v} onClick={()=>setNTo(v)} style={{padding:"9px 4px",borderRadius:12,border:`2px solid ${notifTo===v?"#3b82f6":"#334155"}`,background:notifTo===v?"#1e3a5f":"#0f172a",color:notifTo===v?"#60a5fa":"#64748b",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:11}}>{l}</button>
              ))}
            </div>
            <label style={{fontSize:12,fontWeight:700,color:"#94a3b8",marginBottom:6,display:"block"}}>Message</label>
            <textarea style={{width:"100%",padding:"11px 13px",background:"#0f172a",border:"1.5px solid #334155",borderRadius:10,color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit",resize:"none",marginBottom:10}} rows={3} placeholder="Notification message..." value={notifMsg} onChange={e=>setNM(e.target.value)}/>
            <button onClick={()=>{if(!notifMsg.trim())return;const n={id:Date.now(),to:notifTo,msg:notifMsg,at:new Date().toISOString()};setNL(p=>[n,...p]);setNM("");}}
              style={{width:"100%",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",color:"#fff",border:"none",borderRadius:10,padding:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>
              📤 Send Notification
            </button>
          </div>
          {notifList.length>0&&<div style={{background:"#1e293b",borderRadius:14,padding:14,border:"1px solid #334155"}}>
            <p style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:10}}>📜 Sent Notifications</p>
            {notifList.map(n=>(
              <div key={n.id} style={{padding:"9px 0",borderBottom:"1px solid #0f172a"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <Badge txt={`→ ${n.to}`} color="#60a5fa"/>
                  <p style={{fontSize:10,color:"#475569"}}>{fd(n.at)}</p>
                </div>
                <p style={{fontSize:13,color:"#e2e8f0"}}>{n.msg}</p>
              </div>
            ))}
          </div>}
        </>}

      </div>
    </div>
  );
}


// ═══ CUSTOMER PROFILE ════════════════════════════════════════════════════════
// RBAC: Customer-only screen — no admin data shown
function CustProfile({user,nav,logout}){
  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={{...S.hdr,paddingBottom:22}}>
        <div className="hd">👤</div>
        <div style={{display:"flex",justifyContent:"space-between",position:"relative",zIndex:1}}>
          <div>
            <p style={{fontSize:13,opacity:.8,marginBottom:3}}>👤 My Profile</p>
            <h1 style={{fontSize:22,fontWeight:900}}>{user?.name||"किसान"}</h1>
            <p style={{fontSize:12,opacity:.75,marginTop:2}}>📱 +91 {user?.phone} • 🏘️ {user?.village||"-"}</p>
          </div>
          <button onClick={logout} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",padding:"7px 12px",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Logout</button>
        </div>
      </div>
      <div style={{padding:"16px 15px 90px"}} className="fi">
        <div style={{...S.card,textAlign:"center",paddingTop:24}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#2d8a4e,#1a6b38)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 12px",color:"#fff"}}>
            {(user?.name?.[0]||"K").toUpperCase()}
          </div>
          <h2 style={{fontSize:20,fontWeight:900,color:"#1a3d2a"}}>{user?.name||"किसान"}</h2>
          <p style={{fontSize:13,color:"#7a9e8a",marginTop:4}}>📱 +91 {user?.phone}</p>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10,flexWrap:"wrap"}}>
            {user?.sub&&<span style={{background:"#e8f5e9",color:"#1a6b38",padding:"3px 10px",borderRadius:999,fontSize:12,fontWeight:700}}>⭐ Subscribed</span>}
            {user?.aadDone&&<span style={{background:"#e3f2fd",color:"#1565c0",padding:"3px 10px",borderRadius:999,fontSize:12,fontWeight:700}}>✅ Verified</span>}
          </div>
        </div>
        <div style={S.card}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#0F172A",marginBottom:12}}>📋 Account Details</h3>
          {[["👤 Name",user?.name||"-"],["📱 Mobile",user?.phone||"-"],["🏘️ Village",user?.village||"-"],["🌾 Farm Address",user?.farmAddress||"-"],["⭐ Subscription",user?.sub?`Active — ₹${user.sAmt||0}/yr`:"Not Active"],["✅ Aadhaar",user?.aadDone?"Verified":"Pending"],["📜 7/12",user?.satDone?"Uploaded":"Pending"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #e8f5e9"}}>
              <span style={{fontSize:13,color:"#7a9e8a",fontWeight:600}}>{k}</span>
              <span style={{fontSize:13,color:"#1a3d2a",fontWeight:700,textAlign:"right",maxWidth:"60%"}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#0F172A",marginBottom:12}}>⚡ Quick Actions</h3>
          {[["📋","My Bookings",nav.history],["🚜","Book Service",nav.book],["⭐","Subscription Plan",nav.plans],["💬","Support",nav.support]].map(([i,l,fn])=>(
            <button key={l} onClick={fn} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 4px",background:"none",border:"none",borderBottom:"1px solid #e8f5e9",cursor:"pointer",fontFamily:"inherit"}}>
              <span style={{fontSize:22}}>{i}</span>
              <span style={{fontSize:14,fontWeight:700,color:"#1a3d2a",flex:1,textAlign:"left"}}>{l}</span>
              <span style={{color:"#9ab5a3"}}>→</span>
            </button>
          ))}
        </div>
        <button onClick={logout} style={{...S.btnR,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          🚪 Logout
        </button>
      </div>
      <BNav active="profile" nav={nav}/>
    </div>
  );
}

// ═══ CUSTOMER NOTIFICATIONS ═══════════════════════════════════════════════════
// RBAC: Customer-only — no admin alerts
function CustNotif({nav}){
  const NOTIFS=[
    {id:1,ico:"🚜",t:"Driver Assigned",d:"Ramesh Kumar आपकी booking के लिए assign हुए",time:"2 hrs ago",read:false},
    {id:2,ico:"✅",t:"Booking Confirmed",d:"आपकी नागर्णी service booking confirm हो गई",time:"1 day ago",read:true},
    {id:3,ico:"⭐",t:"Subscription Active",d:"आपका 2 Acre subscription active है",time:"3 days ago",read:true},
    {id:4,ico:"💰",t:"Payment Successful",d:"₹800 payment सफलतापूर्वक हो गई",time:"3 days ago",read:true},
  ];
  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={S.hdr}><div className="hd">🔔</div>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>🔔 Notifications</h1>
        <p style={{opacity:.8,fontSize:13,marginTop:3,position:"relative",zIndex:1}}>Updates & Alerts</p>
      </div>
      <div style={{padding:"16px 15px 90px"}} className="fi">
        {NOTIFS.map(n=>(
          <div key={n.id} style={{...S.card,border:n.read?"1px solid #e8f5e9":"2px solid #4caf50",background:n.read?"#fff":"#f1fff4",marginBottom:8}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:n.read?"#e8f5e9":"#c8e6c9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{n.ico}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <p style={{fontWeight:800,fontSize:14,color:"#1a3d2a"}}>{n.t}</p>
                  {!n.read&&<span style={{background:"#4caf50",color:"#fff",borderRadius:999,width:8,height:8,display:"block",flexShrink:0,marginTop:4}}/>}
                </div>
                <p style={{fontSize:12,color:"#7a9e8a",marginTop:3,lineHeight:1.4}}>{n.d}</p>
                <p style={{fontSize:11,color:"#b0bec5",marginTop:4}}>{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BNav active="notif" nav={nav}/>
    </div>
  );
}

// ═══ CUSTOMER SUPPORT ═════════════════════════════════════════════════════════
// RBAC: Customer-only — no admin contacts
function CustSupport({nav}){
  const [msg,setMsg]=useState("");
  const [sent,setSent]=useState(false);
  const send=()=>{if(!msg.trim())return;setSent(true);setTimeout(()=>{setSent(false);setMsg("");},2500);};
  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={S.hdr}><div className="hd">💬</div>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>💬 Support</h1>
        <p style={{opacity:.8,fontSize:13,marginTop:3,position:"relative",zIndex:1}}>हम आपकी मदद के लिए यहाँ हैं</p>
      </div>
      <div style={{padding:"16px 15px 90px"}} className="fi">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {[["📞","Call Us","9876543210","#1a6b38"],["💬","WhatsApp","Chat करें","#25D366"],["📧","Email","support@kisansetu.in","#1565c0"],["⏰","Hours","9AM - 6PM","#e65100"]].map(([i,l,v,c])=>(
            <div key={l} style={{...S.card,textAlign:"center",marginBottom:0,borderTop:`3px solid ${c}`}}>
              <div style={{fontSize:26,marginBottom:6}}>{i}</div>
              <p style={{fontSize:12,color:"#7a9e8a",fontWeight:600}}>{l}</p>
              <p style={{fontSize:13,fontWeight:800,color:c,marginTop:4}}>{v}</p>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#0F172A",marginBottom:12}}>❓ अक्सर पूछे जाने वाले सवाल</h3>
          {[["Subscription कैसे लें?","Home page पर ⭐ Subscribe button दबाएं और payment करें।"],["Booking cancel कैसे करें?","Support से contact करें — 9876543210।"],["Driver नहीं आया तो?","My Bookings → booking → Chat से driver से contact करें।"],["Payment refund?","Payment के 7 दिन के अंदर support से contact करें।"]].map(([q,a])=>(
            <div key={q} style={{padding:"10px 0",borderBottom:"1px solid #e8f5e9"}}>
              <p style={{fontWeight:700,fontSize:13,color:"#1a3d2a",marginBottom:4}}>❓ {q}</p>
              <p style={{fontSize:12,color:"#7a9e8a",lineHeight:1.5}}>{a}</p>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#0F172A",marginBottom:12}}>📝 Message भेजें</h3>
          {sent?<div style={{background:"#e8f5e9",borderRadius:10,padding:"14px",textAlign:"center"}}>
            <p style={{fontSize:24,marginBottom:6}}>✅</p>
            <p style={{fontWeight:700,color:"#1a6b38"}}>Message भेज दिया गया! हम जल्दी reply करेंगे।</p>
          </div>:<>
            <textarea style={{...S.inp,resize:"none",marginBottom:12}} rows={4} placeholder="अपनी problem या सवाल यहाँ लिखें..." value={msg} onChange={e=>setMsg(e.target.value)}/>
            <button style={S.btnG} onClick={send}>📤 Message भेजें</button>
          </>}
        </div>
      </div>
      <BNav active="support" nav={nav}/>
    </div>
  );
}

// ─── RBAC Guard (utility) ─────────────────────────────────────────────────
// Usage: wrap any screen — if role doesn't match, redirects automatically
function RBACGuard({role,allowed,fallback,children}){
  if(!allowed.includes(role)) return fallback||null;
  return children;
}


// ═══ MERA KHET (MY FARMS) ════════════════════════════════════════════════════
function MeraKhet({user,nav,onSelectKhet}){
  const uid = user?.phone||"guest";
  if(!DB.khets[uid]) DB.khets[uid]=[];
  const [khets,setKhets]   = useState([...DB.khets[uid]]);
  const [adding,setAdding] = useState(false);
  const [editing,setEditing]= useState(null);
  const [form,setForm]     = useState({name:"",village:"",address:"",acres:""});
  const [sat712,setSat712] = useState([]);
  const [uploading,setUpl] = useState(false);
  const [err,setErr]       = useState("");
  const [selDoc,setSelDoc] = useState(null); // {khetIdx, docIdx, khet, doc}
  const inBookingMode      = !!onSelectKhet;

  const save=()=>{
    if(!form.name.trim()){setErr("Khet naam zaruri hai");return;}
    setErr("");
    const khet={id:"K"+Date.now(),name:form.name,village:form.village,address:form.address,acres:parseFloat(form.acres)||1,sat712:[...sat712],addedAt:new Date().toISOString(),bookings:0,lastService:"",lastDate:""};
    if(editing!==null){
      const updated=[...khets];updated[editing]={...updated[editing],...khet,id:updated[editing].id};
      DB.khets[uid]=updated;setKhets(updated);setEditing(null);
    } else {
      const updated=[...khets,khet];DB.khets[uid]=updated;setKhets(updated);
    }
    setForm({name:"",village:"",address:"",acres:""});setSat712([]);setAdding(false);
  };
  const del=i=>{const updated=khets.filter((_,j)=>j!==i);DB.khets[uid]=updated;setKhets(updated);};
  const editKhet=i=>{setForm({name:khets[i].name,village:khets[i].village,address:khets[i].address,acres:String(khets[i].acres)});setSat712(khets[i].sat712||[]);setEditing(i);setAdding(true);};
  const addDoc=(src)=>{setUpl(true);setTimeout(()=>{setSat712(p=>[...p,{id:Date.now(),label:`7/12 Utara #${p.length+1} (${src})`,src,uploadedAt:new Date().toISOString()}]);setUpl(false);},1400);};

  // When user selects a 7/12 doc → go back to booking with that doc + khet info
  const confirmSel=()=>{
    if(!selDoc)return;
    onSelectKhet({
      ...selDoc.khet,
      selected712:selDoc.doc,
      selected712Label:selDoc.doc.label,
    });
  };

  const F=({label,val,onChange,ph,type="text"})=>(
    <div style={{marginBottom:10}}>
      <label style={S.lbl}>{label}</label>
      <input style={S.inp} type={type} inputMode={type==="number"?"numeric":"text"} placeholder={ph||label} value={val} onChange={onChange}/>
    </div>
  );

  return(
    <div style={{background:"#F8FAFC",minHeight:"100vh"}}>
      <div style={S.hdr}><div className="hd">🌾</div>
        <button style={S.bkb} onClick={nav.home}>← Back</button>
        <h1 style={{fontSize:22,fontWeight:900,position:"relative",zIndex:1}}>🌾 Mera Khet</h1>
        {inBookingMode&&<p style={{opacity:.9,fontSize:13,marginTop:4,position:"relative",zIndex:1}}>👇 Sahi 7/12 chunein — booking ke liye</p>}
      </div>
      <div style={{padding:"16px 15px 90px"}} className="fi">

        {/* Booking mode: show confirm bar */}
        {inBookingMode&&selDoc&&<div style={{background:"linear-gradient(135deg,#1b5e20,#2e7d32)",borderRadius:14,padding:"12px 16px",marginBottom:12,color:"#fff"}}>
          <p style={{fontSize:12,opacity:.85,marginBottom:3}}>✅ Selected:</p>
          <p style={{fontWeight:800,fontSize:14}}>{selDoc.khet.name} — {selDoc.doc.label}</p>
          <p style={{fontSize:12,opacity:.8,marginTop:2}}>🏘️ {selDoc.khet.village} • 🌾 {selDoc.khet.acres} Acre</p>
          <button onClick={confirmSel} style={{...S.btnG,marginTop:10,background:"#fff",color:"#1a6b38",fontSize:14,fontWeight:900}}>
            ✅ Is 7/12 se Book karein →
          </button>
        </div>}

        {/* Add / Edit Form */}
        {adding&&<div style={{...S.card,border:"2px solid #2d8a4e",marginBottom:14}}>
          <h3 style={{fontSize:15,fontWeight:800,color:"#14532D",marginBottom:14,letterSpacing:"-.2px"}}>{editing!==null?"✏️ Edit Khet":"➕ Naya Khet Add karein"}</h3>
          <F label="🌾 Khet ka Naam *" val={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} ph="eg: Ghar ke paas wala khet"/>
          <F label="🏘️ Village / Gaon" val={form.village} onChange={e=>setForm(p=>({...p,village:e.target.value}))}/>
          <F label="📍 Full Address" val={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))}/>
          <F label="🌾 Total Acres" val={form.acres} onChange={e=>setForm(p=>({...p,acres:e.target.value}))} type="number"/>
          {/* 7/12 multi upload */}
          <label style={S.lbl}>📜 7/12 Utara Documents</label>
          {sat712.map((d,i)=>(
            <div key={d.id||i} style={{background:"#e8f5e9",borderRadius:12,padding:"9px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1.5px solid #a5d6a7"}}>
              <div><p style={{fontSize:13,fontWeight:700,color:"#1a6b38"}}>✅ {d.label}</p><p style={{fontSize:10,color:"#7a9e8a"}}>{new Date(d.uploadedAt).toLocaleDateString("en-IN")}</p></div>
              <button onClick={()=>setSat712(p=>p.filter((_,j)=>j!==i))} style={{background:"#ffcdd2",border:"none",borderRadius:7,padding:"4px 9px",cursor:"pointer",color:"#c62828",fontWeight:700,fontFamily:"inherit",fontSize:12}}>🗑️</button>
            </div>
          ))}
          {uploading&&<div style={{background:"#e8f5e9",borderRadius:12,padding:"10px",marginBottom:8,textAlign:"center"}}>
            <div style={{fontSize:22,display:"inline-block",animation:"sp 1s linear infinite"}}>🔄</div>
            <p style={{fontSize:12,color:"#1a6b38",fontWeight:700,marginTop:4}}>Upload ho raha hai...</p>
          </div>}
          <div style={{border:`2px ${sat712.length>0?"solid":"dashed"} #2d8a4e`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
            <div style={{background:"#e8f5e9",padding:"8px 12px",textAlign:"center",borderBottom:"1px solid #c8e6c9"}}>
              <p style={{fontSize:13,fontWeight:800,color:"#1a6b38"}}>{sat712.length===0?"📜 7/12 Upload karein":"➕ Add Another 7/12 Utara"}</p>
              {sat712.length>0&&<p style={{fontSize:11,color:"#4a7c5a"}}>{sat712.length} uploaded ✅</p>}
            </div>
            <div style={{display:"flex"}}>
              {[["📷","Camera"],["🖼️","Gallery"],["📄","PDF"]].map(([ico,l],idx,arr)=>(
                <button key={l} onClick={()=>addDoc(l)} disabled={uploading}
                  style={{flex:1,padding:"13px 6px",background:"#fff",border:"none",borderRight:idx<arr.length-1?"1px solid #d4edda":"none",cursor:"pointer",textAlign:"center",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <span style={{fontSize:26}}>{ico}</span><span style={{fontSize:11,fontWeight:700,color:"#1a3d2a"}}>{l}</span>
                </button>
              ))}
            </div>
          </div>
          {err&&<p style={{color:"#EF4444",fontSize:13,marginBottom:8,fontWeight:700}}>⚠️ {err}</p>}
          <div style={{display:"flex",gap:9}}>
            <button style={{...S.btnG,flex:2}} onClick={save}>💾 {editing!==null?"Update karein":"Khet Save karein"}</button>
            <button style={{flex:1,background:"#f5f5f5",color:"#555",border:"none",borderRadius:12,padding:12,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}} onClick={()=>{setAdding(false);setEditing(null);setForm({name:"",village:"",address:"",acres:""});setSat712([]);}}>Cancel</button>
          </div>
        </div>}

        {!adding&&<button onClick={()=>setAdding(true)} style={{width:"100%",background:"linear-gradient(135deg,#2d8a4e,#1a6b38)",color:"#fff",border:"none",borderRadius:14,padding:15,cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:15,marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <span style={{fontSize:22}}>➕</span> Add New Khet
        </button>}

        {khets.length===0&&!adding&&<div style={{textAlign:"center",padding:"40px 18px",color:"#9ab5a3"}}>
          <p style={{fontSize:48}}>🌾</p>
          <h3 style={{fontSize:16,fontWeight:700,marginTop:10}}>Koi Khet nahi hai</h3>
          <p style={{fontSize:13,marginTop:6}}>Pehla khet add karein</p>
        </div>}

        {/* Khet Cards — each 7/12 is selectable when in booking mode */}
        {khets.map((k,ki)=>(
          <div key={k.id} style={{...S.card,border:"1.5px solid #d4edda",marginBottom:12}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
              <div style={{width:48,height:48,borderRadius:12,background:"linear-gradient(135deg,#e8f5e9,#c8e6c9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🌾</div>
              <div style={{flex:1}}>
                <p style={{fontWeight:800,fontSize:15,color:"#1a3d2a"}}>{k.name}</p>
                <p style={{fontSize:12,color:"#7a9e8a",marginTop:2}}>🏘️ {k.village||"—"} • 🌾 {k.acres} Acre</p>
                {k.address&&<p style={{fontSize:12,color:"#7a9e8a"}}>📍 {k.address}</p>}
              </div>
            </div>

            {/* 7/12 Documents — selectable in booking mode */}
            <div style={{marginBottom:10}}>
              <p style={{fontSize:12,fontWeight:700,color:"#4a7c5a",marginBottom:6}}>
                📜 7/12 Documents ({k.sat712?.length||0})
                {inBookingMode&&k.sat712?.length>0&&<span style={{fontSize:11,color:"#9ab5a3",fontWeight:500}}> — tap to select</span>}
              </p>
              {k.sat712&&k.sat712.length>0?(
                k.sat712.map((d,di)=>{
                  const isSelected = selDoc?.khetIdx===ki && selDoc?.docIdx===di;
                  return(
                    <div key={d.id||di}
                      onClick={()=>inBookingMode&&setSelDoc(isSelected?null:{khetIdx:ki,docIdx:di,khet:k,doc:d})}
                      style={{background:isSelected?"#1a6b38":"#e8f5e9",borderRadius:12,padding:"10px 12px",marginBottom:5,
                        border:isSelected?"2px solid #1a6b38":"1.5px solid #a5d6a7",
                        cursor:inBookingMode?"pointer":"default",
                        transition:"all .15s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:16}}>{isSelected?"☑️":"✅"}</span>
                        <div style={{flex:1}}>
                          <p style={{fontSize:13,fontWeight:800,color:isSelected?"#fff":"#1a6b38"}}>7/12 #{di+1} — {d.label}</p>
                          <p style={{fontSize:10,color:isSelected?"rgba(255,255,255,.75)":"#7a9e8a"}}>{new Date(d.uploadedAt).toLocaleDateString("en-IN")} • {d.src}</p>
                        </div>
                        {inBookingMode&&<span style={{fontSize:12,fontWeight:700,color:isSelected?"#ffd54f":"#9ab5a3"}}>{isSelected?"✔ Selected":"Tap"}</span>}
                      </div>
                    </div>
                  );
                })
              ):(
                <p style={{fontSize:12,color:"#e65100",fontWeight:600}}>⚠️ No 7/12 uploaded for this khet</p>
              )}
            </div>

            <div style={{display:"flex",gap:8}}>
              {!inBookingMode&&<button onClick={()=>onSelectKhet&&onSelectKhet(k)} style={{flex:2,...S.btnG,padding:10,fontSize:13}}>🚜 Book karein</button>}
              {inBookingMode&&k.sat712?.length>0&&selDoc?.khetIdx===ki&&(
                <button onClick={confirmSel} style={{flex:2,background:"#1a6b38",color:"#fff",border:"none",borderRadius:12,padding:10,cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:13}}>✅ Is 7/12 se Book karein →</button>
              )}
              <button onClick={()=>editKhet(ki)} style={{flex:1,background:"#e3f2fd",color:"#1565c0",border:"none",borderRadius:12,padding:10,cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:12}}>✏️ Edit</button>
              <button onClick={()=>del(ki)} style={{background:"#ffebee",color:"#c62828",border:"none",borderRadius:12,padding:"10px 12px",cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:13}}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      <BNav active="home" nav={nav}/>
    </div>
  );
}

// ═══ RATING SCREEN ════════════════════════════════════════════════════════════
function RatingScreen({booking,user,onDone}){
  const [stars,setStars] = useState(0);
  const [comment,setComment] = useState("");
  const [saved,setSaved] = useState(false);
  const save=()=>{
    if(stars===0){return;}
    if(!DB.reviews) DB.reviews={};
    DB.reviews[booking?.id]={stars,comment,date:new Date().toISOString(),customerId:user?.phone};
    // update driver avg rating
    const d=DB.drivers[booking?.driverId];
    if(d){
      const allRev=Object.values(DB.reviews).filter(r=>r.customerId!==undefined);
      const driverRevs=Object.entries(DB.reviews).filter(([bid])=>{
        const bk=DB.bookings.find(b=>b.id===bid);
        return bk?.driverId===booking?.driverId;
      });
      if(driverRevs.length>0){
        d.rating=parseFloat((driverRevs.reduce((s,[,r])=>s+r.stars,0)/driverRevs.length).toFixed(1));
      }
    }
    setSaved(true);
  };
  if(saved) return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"22px 20px",background:"linear-gradient(170deg,#e8f5e9,#f0faf0)",textAlign:"center"}}>
      <div style={{fontSize:70,animation:"pop .5s cubic-bezier(.16,1,.3,1)",marginBottom:14}}>⭐</div>
      <h1 style={{fontSize:24,fontWeight:900,color:"#1a6b38",marginBottom:6}}>Shukriya!</h1>
      <p style={{fontSize:15,color:"#4a7c5a",marginBottom:24}}>Aapka review save ho gaya।</p>
      <button style={{...S.btnG,maxWidth:240}} onClick={onDone}>🏠 Home</button>
    </div>
  );
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"22px 20px",background:"linear-gradient(170deg,#e8f5e9,#f0faf0)"}}>
      <div style={{maxWidth:400,margin:"0 auto",width:"100%"}} className="fi">
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:50,animation:"bb 1.4s ease-in-out infinite"}}>⭐</div>
          <h1 style={{fontSize:22,fontWeight:900,color:"#1a6b38",margin:"8px 0 4px"}}>Driver ko Rate karein</h1>
          <p style={{fontSize:13,color:"#4a7c5a"}}>Kaam kaisa laga? Apna feedback dein</p>
        </div>
        <div style={S.card}>
          {booking&&<div style={{background:"#e8f5e9",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
            <p style={{fontWeight:700,fontSize:13,color:"#1a6b38"}}>✅ Booking #{booking.id} Complete</p>
            <p style={{fontSize:12,color:"#4a7c5a",marginTop:3}}>{booking.icon} {booking.serviceNameHi} • {booking.acres}Ac</p>
          </div>}
          <p style={{fontWeight:800,fontSize:15,color:"#1a3d2a",textAlign:"center",marginBottom:16}}>Stars dein (1-5)</p>
          <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:20}}>
            {[1,2,3,4,5].map(s=>(
              <button key={s} onClick={()=>setStars(s)} style={{fontSize:36,background:"none",border:"none",cursor:"pointer",opacity:s<=stars?1:0.3,transition:"all .15s",transform:s<=stars?"scale(1.2)":"scale(1)"}}>⭐</button>
            ))}
          </div>
          {stars>0&&<p style={{textAlign:"center",fontSize:14,fontWeight:700,color:"#1a6b38",marginBottom:12}}>
            {["","Bahut kharab","Kharab","Theek hai","Achha tha","Bahut achha!"][stars]}
          </p>}
          <label style={S.lbl}>📝 Comment (Optional)</label>
          <textarea style={{...S.inp,resize:"none",marginBottom:14}} rows={3} placeholder="Driver ke baare mein kuch bolen..." value={comment} onChange={e=>setComment(e.target.value)}/>
          {stars===0&&<p style={{color:"#e65100",fontSize:13,marginBottom:8,textAlign:"center"}}>⚠️ Pehle stars chunein</p>}
          <button style={{...S.btnG,opacity:stars===0?0.5:1}} onClick={save} disabled={stars===0}>⭐ Rating Submit karein</button>
          <button style={S.btnW} onClick={onDone}>Skip karein</button>
        </div>
      </div>
    </div>
  );
}

function BCard({b,full,admin,onChat}){
  const statusColor = b.status==="Completed"?"#16a34a":b.status==="Ongoing"?"#ea580c":b.status==="Cancelled"?"#ef4444":"#3b82f6";
  const statusBg    = b.status==="Completed"?"#f0fdf4":b.status==="Ongoing"?"#fff7ed":b.status==="Cancelled"?"#fef2f2":"#eff6ff";
  return(
    <div style={{background:"#fff",borderRadius:20,padding:16,marginBottom:12,boxShadow:"0 2px 16px rgba(0,0,0,.06)",border:"1px solid rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{width:46,height:46,borderRadius:14,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:"1px solid #bbf7d0"}}>{b.icon}</div>
        <div style={{flex:1}}>
          <p style={{fontWeight:800,fontSize:14,color:"#0f172a",margin:"0 0 3px"}}>{b.serviceNameHi}</p>
          <p style={{fontSize:11,color:"#64748b",margin:"0 0 6px"}}>📅 {fd(b.date)} • 🌾 {b.acres}Ac</p>
          {b.status!=="Completed"&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:"5px 10px"}}>
            <span style={{fontSize:11,fontWeight:700,color:"#c2410c"}}>🔑 OTP:</span>
            <span style={{fontSize:16,fontWeight:900,color:"#dc2626",letterSpacing:4}}>1234</span>
          </div>}
          {full&&<p style={{fontSize:10,color:"#cbd5e1",margin:"4px 0 0"}}>ID: {b.id} • {b.payMethod}</p>}
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <p style={{fontWeight:900,color:"#16a34a",fontSize:16,margin:"0 0 4px"}}>₹{b.amount}</p>
          <span style={{background:statusBg,color:statusColor,padding:"3px 10px",borderRadius:999,fontSize:10,fontWeight:700,display:"block"}}>{b.status}</span>
        </div>
      </div>
    </div>
  );
}

function BNav({active,nav}){
  return(
    <nav style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,background:"rgba(255,255,255,.95)",backdropFilter:"blur(20px)",borderRadius:24,display:"flex",justifyContent:"space-around",padding:"10px 8px 12px",boxShadow:"0 8px 32px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.04)",zIndex:100}}>
      {[{k:"home",i:"🏠",l:"Home"},{k:"book",i:"🚜",l:"Book"},{k:"history",i:"📋",l:"Bookings"},{k:"notif",i:"🔔",l:"Alerts"},{k:"profile",i:"👤",l:"Profile"}].map(it=>(
        <button key={it.k} onClick={nav[it.k]||nav.home}
          style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 10px",border:"none",background:active===it.k?"#16a34a":"transparent",borderRadius:14,fontFamily:"inherit",transition:"all .2s",minWidth:52}}>
          <span style={{fontSize:19,filter:active===it.k?"none":"grayscale(.4)"}}>{it.i}</span>
          <span style={{fontSize:9,fontWeight:700,color:active===it.k?"#fff":"#94a3b8"}}>{it.l}</span>
        </button>
      ))}
    </nav>
  );
}

function DNNav({active,dnav}){
  return(
    <nav style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,background:"rgba(15,23,42,.95)",backdropFilter:"blur(20px)",borderRadius:24,display:"flex",justifyContent:"space-around",padding:"10px 8px 12px",boxShadow:"0 8px 32px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.07)",zIndex:100}}>
      {[{k:"home",i:"🏠",l:"Home"},{k:"bookings",i:"📋",l:"Jobs"},{k:"earnings",i:"💰",l:"Earnings"},{k:"leaderboard",i:"🏆",l:"Rank"},{k:"incentive",i:"💎",l:"Incentive"}].map(it=>(
        <button key={it.k} onClick={dnav[it.k]||dnav.home}
          style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 10px",border:"none",background:active===it.k?"rgba(22,163,74,.25)":"transparent",borderRadius:14,fontFamily:"inherit",transition:"all .2s",minWidth:52}}>
          <span style={{fontSize:19}}>{it.i}</span>
          <span style={{fontSize:9,fontWeight:700,color:active===it.k?"#4ade80":"rgba(255,255,255,.4)"}}>{it.l}</span>
        </button>
      ))}
    </nav>
  );
}


export default App;
