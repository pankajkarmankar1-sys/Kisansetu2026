import { useState, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function Reg({ phone, onDone, back }) {

  // ===============================
  // Personal Details
  // ===============================

  const [name, setName] = useState("");
  const [farm, setFarm] = useState("");
  const [mobile, setMobile] = useState(phone || "");

  // ===============================
  // Location
  // ===============================

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");

  // ===============================
  // Aadhaar
  // ===============================

  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState("");

  const aadhaarInput = useRef(null);

  // ===============================
  // 7/12 Documents
  // ===============================

  const [documents, setDocuments] = useState([]);

  const sevenInput = useRef(null);

  // ===============================
  // Loading
  // ===============================

  const [loading, setLoading] = useState(false);

  // ===============================
  // Errors
  // ===============================

  const [errors, setErrors] = useState({});
    // ===============================
  // Aadhaar Upload
  // ===============================

  const pickAadhaar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAadhaarFile(file);

    if (file.type.startsWith("image")) {
      setAadhaarPreview(URL.createObjectURL(file));
    } else {
      setAadhaarPreview("");
    }
  };

  // ===============================
  // 7/12 Upload
  // ===============================

  const pick712 = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const obj = {
      id: Date.now(),
      file,
      preview: file.type.startsWith("image")
        ? URL.createObjectURL(file)
        : "",
      village,
      state,
      district,
      taluka,
    };

    setDocuments((prev) => [...prev, obj]);
  };

  function remove712(id) {
    setDocuments((prev) => prev.filter((item) => item.id !== id));
  }
  // ===============================
// Registration
// ===============================

async function registerCustomer() {

  const e = {};

  if (!name) e.name = true;
  if (!farm) e.farm = true;
  if (mobile.length !== 10) e.mobile = true;
  if (!state) e.state = true;
  if (!district) e.district = true;
  if (!taluka) e.taluka = true;
  if (!village) e.village = true;
  if (!aadhaarFile) e.aadhaar = true;
  if (documents.length === 0) e.documents = true;

  setErrors(e);

  if (Object.keys(e).length) return;

  setLoading(true);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setLoading(false);
    alert("Please login first.");
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      name: name,
      phone: mobile,
      role: "customer",
    });

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Registration Successful");

  if (onDone) {
    onDone({
      name,
      farm,
      mobile,
      state,
      district,
      taluka,
      village,
      aadhaarFile,
      documents,
    });
  }
}
  // ===============================
// Save Customer Details
// ===============================

const { error: customerError } = await supabase
  .from("customers")
  .upsert({
    id: user.id,
    name,
    phone: mobile,
    farm,
    state,
    district,
    taluka,
    village,
    created_at: new Date().toISOString(),
  });

if (customerError) {
  setLoading(false);
  alert(customerError.message);
  return;
}

setLoading(false);

alert("Registration Successful");

if (onDone) {
  onDone({
    name,
    farm,
    mobile,
    state,
    district,
    taluka,
    village,
    aadhaarFile,
    documents,
  });
}

window.location.href = "/dashboard";
  // ===============================
// Upload Aadhaar
// ===============================

const aadhaarPath = `${user.id}/aadhaar_${Date.now()}`;

const { error: aadhaarError } = await supabase.storage
  .from("aadhaar")
  .upload(aadhaarPath, aadhaarFile);

if (aadhaarError) {
  setLoading(false);
  alert(aadhaarError.message);
  return;
}

const {
  data: { publicUrl: aadhaarUrl },
} = supabase.storage
  .from("aadhaar")
  .getPublicUrl(aadhaarPath);

// ===============================
// Upload 7/12 Documents
// ===============================

const documentUrls = [];

for (const doc of documents) {
  const filePath = `${user.id}/712_${Date.now()}_${doc.file.name}`;

  const { error } = await supabase.storage
    .from("land-documents")
    .upload(filePath, doc.file);

  if (error) {
    setLoading(false);
    alert(error.message);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("land-documents")
    .getPublicUrl(filePath);

  documentUrls.push(publicUrl);
}
  const { error: customerError } = await supabase
  .from("customers")
  .upsert({
    id: user.id,
    name: name,
    phone: mobile,
    farm: farm,
    state: state,
    district: district,
    taluka: taluka,
    village: village,
    role: "customer",
    aadhaar_url: aadhaarUrl,
    land_documents: documentUrls,
    created_at: new Date().toISOString(),
  });

if (customerError) {
  setLoading(false);
  alert(customerError.message);
  return;
}

setLoading(false);

alert("✅ Registration Successful");

if (onDone) {
  onDone({
    name,
    farm,
    mobile,
    state,
    district,
    taluka,
    village,
  });
}

window.location.href = "/dashboard";
  
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const [customer, setCustomer] = useState(null);

useEffect(() => {
  loadCustomer();
}, []);

async function loadCustomer() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!error) {
    setCustomer(data);
  }
}
  import { supabase } from "../lib/supabase";

async function bookTractor(data) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first");
    return;
  }

  const { error } = await supabase
    .from("bookings")
    .insert([
      {
        customer_id: user.id,
        customer_name: data.name,
        phone: data.phone,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        service: data.service,
        acres: data.acres,
        booking_date: data.booking_date,
        status: "Pending",
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("✅ Booking Created Successfully");
}
  import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();

    const channel = supabase
      .channel("driver-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          loadBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBookings(data);
  }

  async function acceptBooking(id) {
    await supabase
      .from("bookings")
      .update({
        status: "Accepted",
      })
      .eq("id", id);

    loadBookings();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Driver Bookings</h2>

      {bookings.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
          }}
        >
          <h3>{b.customer_name}</h3>

          <p>{b.phone}</p>

          <p>{b.village}</p>

          <p>{b.service}</p>

          <p>Status : {b.status}</p>

          {b.status === "Pending" && (
            <button onClick={() => acceptBooking(b.id)}>
              Accept Booking
            </button>
          )}
        </div>
      ))}
    </div>
  );

}
  import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setBookings(data || []);
  }

  async function updateStatus(id, status) {
    await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    loadBookings();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {bookings.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 15,
            marginBottom: 15,
          }}
        >
          <h3>{b.customer_name}</h3>

          <p>📞 {b.phone}</p>

          <p>📍 {b.village}</p>

          <p>🚜 {b.service}</p>

          <p>Status : {b.status}</p>

          <button
            onClick={() => updateStatus(b.id, "Accepted")}
          >
            Accept
          </button>

          <button
            onClick={() => updateStatus(b.id, "Rejected")}
            style={{ marginLeft: 10 }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
  import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CustomerTracking({ driverId }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    loadLocation();

    const channel = supabase
      .channel("driver-location")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_locations",
        },
        () => {
          loadLocation();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadLocation() {
    const { data } = await supabase
      .from("driver_locations")
      .select("*")
      .eq("driver_id", driverId)
      .single();

    if (data) {
      setLocation(data);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🚜 Live Driver Location</h2>

      {location ? (
        <>
          <p>Latitude : {location.latitude}</p>
          <p>Longitude : {location.longitude}</p>

          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            📍 Open in Google Maps
          </a>
        </>
      ) : (
        <p>Waiting for driver location...</p>
      )}
    </div>
  );
}
  npm install @react-google-maps/api
  import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";

export default function CustomerMap({
  customerLocation,
  driverLocation,
}) {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  });

  const [directions, setDirections] = useState(null);

  useEffect(() => {

    if (!isLoaded) return;

    if (!customerLocation || !driverLocation) return;

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: driverLocation,
        destination: customerLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }
      }
    );

  }, [isLoaded, customerLocation, driverLocation]);

  if (!isLoaded) return <h3>Loading Map...</h3>;

  return (
    <GoogleMap
      zoom={13}
      center={customerLocation}
      mapContainerStyle={{
        width: "100%",
        height: "500px",
      }}
    >

      <Marker position={customerLocation} />

      <Marker position={driverLocation} />

      {directions && (
        <DirectionsRenderer directions={directions} />
      )}

    </GoogleMap>
  );

}
  import { useState } from "react";
import { supabase } from "../lib/supabase"; // path adjust kar lena

export default function Reg({ phone, onDone, back }) {

  const [name, setName] = useState("");
  const [farm, setFarm] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !farm || !district) {
      setError("❌ Sab fields fill karo");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("customers")
        .insert([
          {
            phone,
            name,
            farm_name: farm,
            district,
            created_at: new Date(),
          },
        ]);

      if (error) throw error;

      setLoading(false);

      // success → next step
      onDone && onDone(data);

    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Customer Registration</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Farm Name"
          value={farm}
          onChange={(e) => setFarm(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />

        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>

        <button type="button" onClick={back}>
          Back
        </button>

      </form>
    </div>
  );
}
  // success → save local session + redirect
onDone &&
  onDone({
    phone,
    name,
    farm,
    district,
  });
  import { useState, useEffect } from "react";
import Reg from "./components/Reg";
import CustomerDashboard from "./pages/CustomerDashboard";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("kisan_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);
  function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
  }

  function handleDone(data) {
    localStorage.setItem("kisan_user", JSON.stringify(data));
    setUser(data);
  }

  function logout() {
    localStorage.removeItem("kisan_user");
    setUser(null);
  }

  if (!user) {
    return <Reg phone={"9999999999"} onDone={handleDone} />;
  }

  return <CustomerDashboard user={user} logout={logout} />;
}
  export default function CustomerDashboard({ user, logout }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>🚜 Customer Dashboard</h2>

      <p>Welcome, {user.name}</p>
      <p>Farm: {user.farm}</p>
      <p>District: {user.district}</p>
      <p>Phone: {user.phone}</p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
  }
  
  import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function NearbyDrivers({ userLocation }) {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    const { data } = await supabase.from("drivers").select("*");

    const sorted = (data || [])
      .map((d) => ({
        ...d,
        distance: getDistance(
          userLocation.lat,
          userLocation.lng,
          d.latitude,
          d.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    setDrivers(sorted);
  }

  return (
    <div>
      <h2>🚜 Nearby Drivers</h2>

      {drivers.map((d) => (
        <div key={d.id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <p>{d.name}</p>
          <p>Distance: {d.distance.toFixed(2)} km</p>
        </div>
      ))}
    </div>
  );
}
  import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function DriverMap({ drivers }) {
  return (
    <MapContainer
      center={[21.1458, 79.0882]}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {drivers.map((d) => (
        <Marker key={d.id} position={[d.latitude, d.longitude]}>
          <Popup>
            <b>{d.name}</b>
            <br />
            Vehicle: {d.vehicle}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
  import { supabase } from "../lib/supabase";

export async function sendOTP(phone) {
  const { error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });

  if (error) throw error;
}
  export async function verifyOTP(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone,
    token: token,
    type: "sms",
  });

  if (error) throw error;

  return data;
  }
  function payViaUPI(amount) {
  const upiId = "yourupi@bank";

  const url = `upi://pay?pa=${upiId}&pn=KisanSetu&am=${amount}&cu=INR`;

  window.location.href = url;
  }
  import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Earnings({ driver }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("bookings")
      .select("amount")
      .eq("driver_id", driver.id)
      .eq("status", "completed");

    const sum = (data || []).reduce((a, b) => a + (b.amount || 0), 0);

    setTotal(sum);
  }

  return (
    <div>
      <h2>💰 Earnings</h2>
      <h1>₹ {total}</h1>
    </div>
  );
}
  export function enableNotifications() {
  Notification.requestPermission();
  }
  export function notify(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
    });
  }
  }
  notify("🚜 New Booking", "A new driver request arrived!");
  import express from "express";
import Razorpay from "razorpay";

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});
  app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100, // paise
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  });

  res.json(order);
});
  async function pay(amount) {
  const res = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const order = await res.json();

  const options = {
    key: "YOUR_KEY_ID",
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    handler: function (response) {
      alert("Payment Success ✅");
      console.log(response);
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
  }
  function calculatePayment(amount) {
  const commission = amount * 0.1; // 10%
  const driverEarning = amount - commission;

  return { commission, driverEarning };
  }
  async function completeBooking(bookingId, amount) {
  const { commission, driverEarning } = calculatePayment(amount);

  await supabase
    .from("bookings")
    .update({
      status: "completed",
      commission,
      driver_earning: driverEarning,
      payment_status: "paid",
    })
    .eq("id", bookingId);
  }
  async function updateWallet(driverId, amount) {
  const { data } = await supabase
    .from("driver_wallet")
    .select("*")
    .eq("driver_id", driverId)
    .single();

  if (data) {
    await supabase
      .from("driver_wallet")
      .update({
        total_earning: data.total_earning + amount,
      })
      .eq("driver_id", driverId);
  } else {
    await supabase.from("driver_wallet").insert([
      {
        driver_id: driverId,
        total_earning: amount,
      },
    ]);
  }
  }
  async function requestWithdraw(driverId, amount) {
  await supabase.from("withdrawals").insert([
    {
      driver_id: driverId,
      amount,
      status: "pending",
    },
  ]);

  alert("Withdraw request sent ✅");
  }
  import { supabase } from "../lib/supabase";

export async function submitReview(bookingId, driverId, phone, rating, comment) {
  await supabase.from("reviews").insert([
    {
      booking_id: bookingId,
      driver_id: driverId,
      customer_phone: phone,
      rating,
      comment,
    },
  ]);

  alert("Review submitted ⭐");
}
  export async function getDriverRating(driverId) {
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("driver_id", driverId);

  const ratings = data || [];

  const avg =
    ratings.reduce((a, b) => a + b.rating, 0) / (ratings.length || 1);

  return avg.toFixed(1);
  }
  export async function sendMessage(bookingId, sender, message) {
  await supabase.from("messages").insert([
    {
      booking_id: bookingId,
      sender,
      message,
    },
  ]);
  }
  import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Chat({ bookingId }) {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("chat")
      
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        () => load()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function load() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId);

    setMsgs(data || []);
  }

  return (
    <div>
      {msgs.map((m) => (
        <p key={m.id}>
          <b>{m.sender}:</b> {m.message}
        </p>
      ))}
    </div>
  );
}
  import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Chat({ bookingId }) {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        () => load()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function load() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId);

    setMsgs(data || []);
  }

  return (
    <div>
      {msgs.map((m) => (
        <p key={m.id}>
          <b>{m.sender}:</b> {m.message}
        </p>
      ))}
    </div>
  );
}
  export default function AdminPanel({ supabase }) {
  async function blockDriver(id) {
    await supabase
      .from("drivers")
      .update({ blocked: true })
      .eq("id", id);
  }

  return (
    <div>
      <h2>🧠 Admin Control</h2>
      <p>Full system monitoring enabled</p>
    </div>
  );
  }
  export function generateInvoice(booking) {
  return {
    invoiceId: "INV-" + booking.id.slice(0, 6),
    amount: booking.amount,
    commission: booking.commission,
    driverEarning: booking.driver_earning,
    date: new Date().toISOString(),
  };
  }
  import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);
  import { getToken } from "firebase/messaging";

export async function sendPush(message) {
  console.log("Push sent:", message);
}
  export async function assignDriver(booking, drivers) {
  let best = null;
  let minDistance = 999999;

  drivers.forEach((d) => {
    const dist = Math.sqrt(
      Math.pow(d.latitude - booking.lat, 2) +
      Math.pow(d.longitude - booking.lng, 2)
    );

    if (dist < minDistance) {
      minDistance = dist;
      best = d;
    }
  });

  return best;
  }
  export async function autoAssignBooking(booking) {
  const { data: drivers } = await supabase.from("drivers").select("*");

  const bestDriver = await assignDriver(booking, drivers);

  await supabase
    .from("bookings")
    .update({
      driver_id: bestDriver.id,
      status: "assigned",
    })
    .eq("id", booking.id);
  }
  create policy "Users can view own bookings"
on bookings
for select
using (customer_phone = auth.jwt() ->> 'phone');
  create policy "Drivers only see own bookings"
on bookings
for select
using (driver_id = auth.uid());
