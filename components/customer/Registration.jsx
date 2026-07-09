import { useState } from "react";
import { supabase } from "../../lib/supabase";
import CustomerLocation from "./CustomerLocation";
import LocationSelector from "../maps/LocationSelector";

export default function Reg({
  phone,
  onDone,
  back,
}) {

  const [name, setName] = useState("");

  const [farmAddress, setFarmAddress] = useState("");

  const [acres, setAcres] = useState("");

  const [location, setLocation] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function handleLocation(data) {

    setLocation(data);

  }
  async function handleSubmit(e) {

  e.preventDefault();

  setError("");

  if (!name) {
    setError("Please enter your name");
    return;
  }

  if (!farmAddress) {
    setError("Please enter farm address");
    return;
  }

  if (!acres || Number(acres) <= 0) {
    setError("Please enter valid acres");
    return;
  }

  if (!location) {
    setError("Please select your location");
    return;
  }

  try {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Please login again");
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        auth_user_id: user.id,
        phone: phone,
        role: "farmer",
        name: name,
        village: location.village || "",
        state: location.state || "",
        district: location.district || "",
        taluka: location.taluka || "",
        farm_address: farmAddress,
        acres: Number(acres),
        latitude: location.latitude || location.lat || null,
        longitude: location.longitude || location.lng || null,
      });

    if (error) throw error;

    if (onDone) {
      onDone();
    }

  } catch (err) {

    setError(err.message);

  } finally {

    setLoading(false);

  }

}
  return (

  <div style={{ padding: 20 }}>

    <h2>👨‍🌾 Farmer Registration</h2>

    <form onSubmit={handleSubmit}>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
        }}
      />

      <input
        placeholder="Farm Address"
        value={farmAddress}
        onChange={(e) => setFarmAddress(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
        }}
      />

      <input
        type="number"
        placeholder="Total Acres"
        value={acres}
        onChange={(e) => setAcres(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
        }}
      />

      <LocationSelector
        onSelect={handleLocation}
      />

      <br />

      <CustomerLocation
        onLocationSelect={(loc) =>
          setLocation((prev) => ({
            ...prev,
            ...loc,
          }))
        }
      />

      {error && (
        <p
          style={{
            color: "red",
            marginTop: 10,
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 14,
          marginTop: 20,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 16,
        }}
      >
        {loading
          ? "Saving..."
          : "✅ Complete Registration"}
      </button>

      {back && (
        <button
          type="button"
          onClick={back}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 10,
          }}
        >
          ← Back
        </button>
      )}

    </form>

  </div>

);

}
