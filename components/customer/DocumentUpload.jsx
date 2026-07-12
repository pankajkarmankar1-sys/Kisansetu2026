import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AddFarm({
  onSaved,
  back,
}) {

  const [loading, setLoading] = useState(false);

  const [farm, setFarm] = useState({
    name: "",
    village: "",
    state: "Maharashtra",
    district: "",
    taluka: "",
    farm_address: "",
    acres: "",
    latitude: "",
    longitude: "",
  });

  const [documents, setDocuments] = useState([]);

  const [message, setMessage] = useState("");

  function updateField(key, value) {
    setFarm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFarm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => {}
    );
  }, []);

  function handleDocumentChange(e) {
    const files = Array.from(e.target.files || []);
    setDocuments(files);
  }
  async function uploadDocuments(khetId, userId) {
    for (const file of documents) {
      const fileName =
        `${userId}/${Date.now()}-${file.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("khet-documents")
          .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } =
        await supabase
          .from("khet_documents")
          .insert({
            khet_id: khetId,
            user_id: userId,
            file_name: file.name,
            storage_path: fileName,
          });

      if (dbError) throw dbError;
    }
  }

  async function saveFarm() {
    try {

      setLoading(true);
      setMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        alert("Please login first.");
        return;
      }

      if (!farm.name.trim()) {
        alert("Enter Farm Name");
        return;
      }

      if (!farm.village.trim()) {
        alert("Enter Village");
        return;
      }

      if (!farm.acres) {
        alert("Enter Acres");
        return;
      }

      const {
        data: insertedFarm,
        error: insertError,
      } = await supabase
        .from("khets")
        .insert({
          user_id: user.id,
          name: farm.name,
          village: farm.village,
          state: farm.state,
          district: farm.district,
          taluka: farm.taluka,
          farm_address: farm.farm_address,
          acres: Number(farm.acres),
          latitude: farm.latitude,
          longitude: farm.longitude,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      await uploadDocuments(
        insertedFarm.id,
        user.id
      );

      setMessage("✅ Farm added successfully.");

      setFarm({
        name: "",
        village: "",
        state: "Maharashtra",
        district: "",
        taluka: "",
        farm_address: "",
        acres: "",
        latitude: "",
        longitude: "",
      });

      setDocuments([]);

      if (onSaved) {
        onSaved(insertedFarm);
      }

    } catch (err) {
      console.error(err);

      setMessage(
        err.message || "Unable to save farm."
      );

    } finally {
      setLoading(false);
    }
  }

  return (

    <div className="max-w-3xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6">
        🌾 Add New Farm
      </h2>

      {message && (
        <div className="mb-4 rounded bg-green-100 p-3">
          {message}
        </div>
      )}
      <input
        type="text"
        placeholder="Farm Name"
        value={farm.name}
        onChange={(e) => updateField("name", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="text"
        placeholder="Village Name"
        value={farm.village}
        onChange={(e) => updateField("village", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="text"
        placeholder="State"
        value={farm.state}
        onChange={(e) => updateField("state", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="text"
        placeholder="District"
        value={farm.district}
        onChange={(e) => updateField("district", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="text"
        placeholder="Taluka"
        value={farm.taluka}
        onChange={(e) => updateField("taluka", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="text"
        placeholder="Farm Address"
        value={farm.farm_address}
        onChange={(e) => updateField("farm_address", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="number"
        placeholder="Area (Acres)"
        value={farm.acres}
        onChange={(e) => updateField("acres", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">

        <input
          type="text"
          placeholder="Latitude"
          value={farm.latitude}
          readOnly
          className="w-full border rounded-lg p-3 bg-gray-100"
        />

        <input
          type="text"
          placeholder="Longitude"
          value={farm.longitude}
          readOnly
          className="w-full border rounded-lg p-3 bg-gray-100"
        />

      </div>

      <div className="mb-6">

        <label className="block font-semibold mb-2">
          Upload 7/12 or Other Farm Documents
        </label>

        <input
          type="file"
          multiple
          accept=".pdf,image/*"
          onChange={handleDocumentChange}
          className="w-full border rounded-lg p-3"
        />

        {documents.length > 0 && (
          <div className="mt-3">

            <p className="font-medium">
              Selected Documents
            </p>

            <ul className="list-disc ml-5 mt-2">
              {documents.map((file, index) => (
                <li key={index}>
                  {file.name}
                </li>
              ))}
            </ul>

          </div>
        )}

      </div>
      <div className="flex gap-4 mt-6">

        <button
          type="button"
          onClick={back}
          className="flex-1 bg-gray-300 text-black py-3 rounded-lg font-semibold"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={saveFarm}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Saving..." : "💾 Save Farm"}
        </button>

      </div>

    </div>

  );

}
