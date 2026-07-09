import React, { useState } from "react";
import KhetLocationPicker from "./KhetLocationPicker";

export default function FarmSelection({
  selKhet,
  setSelKhet,
  next,
  back,
}) {
  const [farmName, setFarmName] = useState(selKhet?.name || "");
  const [state, setState] = useState(selKhet?.state || "");
  const [district, setDistrict] = useState(selKhet?.district || "");
  const [taluka, setTaluka] = useState(selKhet?.taluka || "");
  const [village, setVillage] = useState(selKhet?.village || "");
  const [surveyNo, setSurveyNo] = useState(selKhet?.surveyNo || "");
  const [acres, setAcres] = useState(selKhet?.acres || "");
  const [location, setLocation] = useState(selKhet?.location || null);

  function saveFarm() {
    if (!farmName) {
      alert("Enter Farm Name");
      return;
    }

    if (!state) {
      alert("Enter State");
      return;
    }

    if (!district) {
      alert("Enter District");
      return;
    }

    if (!taluka) {
      alert("Enter Taluka");
      return;
    }

    if (!village) {
      alert("Enter Village");
      return;
    }

    if (!acres || Number(acres) <= 0) {
      alert("Enter Valid Acres");
      return;
    }

    const farm = {
      name: farmName,
      state,
      district,
      taluka,
      village,
      surveyNo,
      acres: Number(acres),
      location,
    };

    setSelKhet(farm);
    localStorage.setItem("selectedFarm", JSON.stringify(farm));

    next();
  }

  return (
    <div
      style={{
        padding: 20,
        background: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <h2>🌾 Farm Details</h2>

      <input
        placeholder="Farm Name"
        value={farmName}
        onChange={(e) => setFarmName(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Taluka"
        value={taluka}
        onChange={(e) => setTaluka(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Village"
        value={village}
        onChange={(e) => setVillage(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Survey / Gat Number"
        value={surveyNo}
        onChange={(e) => setSurveyNo(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Total Acres"
        value={acres}
        onChange={(e) => setAcres(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      <KhetLocationPicker
        onSave={(loc) => setLocation(loc)}
      />

      <div style={{ marginTop: 20 }}>
        <button
          onClick={back}
          style={{
            padding: 12,
            marginRight: 10,
          }}
        >
          ← Back
        </button>

        <button
          onClick={saveFarm}
          style={{
            padding: 12,
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
