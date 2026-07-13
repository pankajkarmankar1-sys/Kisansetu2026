import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LocationSelector({ onSelect }) {

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");

  const [searchVillage, setSearchVillage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStates();
  }, []);

  async function loadStates() {

   const { data, error } = await supabase
  .from("locations")
  .select("state");

    if (error) {
      console.log(error);
      return;
    }

    const uniqueStates = [
      ...new Set(data.map(x => x.state))
    ].sort();

    setStates(uniqueStates);
  }

  async function loadDistricts(selectedState) {

    const { data, error } = await supabase
  .from("locations")
  .select("district")
  .eq("state", selectedState);

    if (error) {
      console.log(error);
      return;
    }

    const uniqueDistricts = [
      ...new Set(data.map(x => x.district))
    ].sort();

    setDistricts(uniqueDistricts);
  }

  async function loadTalukas(selectedDistrict) {

    const { data, error } = await supabase
  .from("locations")
  .select("taluka")
  .eq("district", selectedDistrict);
    if (error) {
      console.log(error);
      return;
    }

    const uniqueTalukas = [
      ...new Set(data.map(x => x.taluka))
    ].sort();

    setTalukas(uniqueTalukas);
  }
  async function loadVillages(selectedState, selectedDistrict, selectedTaluka) {

    const { data, error } = await supabase
  .from("locations")
  .select("village")
  .eq("state", selectedState)
  .eq("district", selectedDistrict)
  .eq("taluka", selectedTaluka)
  .order("village");

    if (error) {
      console.log(error);
      return;
    }

    setVillages(data || []);
  }

  useEffect(() => {
    if (state) {
      loadDistricts(state);
      setDistrict("");
      setTaluka("");
      setVillage("");
      setVillages([]);
    }
  }, [state]);

  useEffect(() => {
    if (district) {
      loadTalukas(district);
      setTaluka("");
      setVillage("");
      setVillages([]);
    }
  }, [district]);

  useEffect(() => {
    if (taluka) {
      loadVillages(state, district, taluka);
      setVillage("");
      setSearchVillage("");
    }
  }, [taluka]);

  function saveLocation() {

    if (!state || !district || !taluka || !village) {
      alert("Please select State, District, Taluka and Village");
      return;
    }

    const data = {
      state,
      district,
      taluka,
      village
    };

    localStorage.setItem(
      "location",
      JSON.stringify(data)
    );

    if (onSelect) {
      onSelect(data);
    }
  }

  function useCurrentLocation() {

    setLoading(true);

    navigator.geolocation.getCurrentPosition(

      (p) => {

        const data = {
          state,
          district,
          taluka,
          village,
          latitude: p.coords.latitude,
          longitude: p.coords.longitude
        };

        if (onSelect) {
          onSelect(data);
        }

        setLoading(false);

      },

      () => {

        alert("Location permission denied");

        setLoading(false);

      }

    );

  }
  return (

    <div
      style={{
        maxWidth: 420,
        margin: "20px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 12
      }}
    >

      <h2>📍 Select Farm Location</h2>

      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      >
        <option value="">Select State</option>

        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}

      </select>

      <select
        value={district}
        disabled={!state}
        onChange={(e) => setDistrict(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      >
        <option value="">Select District</option>

        {districts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}

      </select>

      <select
        value={taluka}
        disabled={!district}
        onChange={(e) => setTaluka(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      >
        <option value="">Select Taluka</option>

        {talukas.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}

      </select>

      <input
        value={searchVillage}
        disabled={!taluka}
        placeholder="Search Village"
        onChange={(e) => {
          setSearchVillage(e.target.value);
          setVillage(e.target.value);
        }}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 5
        }}
      />

      {searchVillage && (
        <div
          style={{
            border: "1px solid #ccc",
            maxHeight: 160,
            overflow: "auto",
            marginBottom: 10
          }}
        >
          {villages
            .filter((v) =>
              v.village
                .toLowerCase()
                .includes(searchVillage.toLowerCase())
            )
            .map((v) => (
              <div
                key={v.village}
                onClick={() => {
  const selected = {
    state,
    district,
    taluka,
    village: v.village,
    latitude: "",
    longitude: "",
  };

  setVillage(v.village);
  setSearchVillage(v.village);

  localStorage.setItem(
    "location",
    JSON.stringify(selected)
  );

  if (onSelect) {
    onSelect(selected);
  }
}}
                
                style={{
                  padding: 10,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee"
                }}
              >
                {v.village}
              </div>
            ))}
        </div>
      )}

      <button
        onClick={saveLocation}
        style={{
          width: "100%",
          padding: 12,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          marginTop: 10
        }}
      >
        ✅ Save Location
      </button>

      <button
        onClick={useCurrentLocation}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          marginTop: 10
        }}
      >
        {loading ? "Getting GPS..." : "📍 Use GPS"}
      </button>

    </div>

  );

}
