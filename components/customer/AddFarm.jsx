import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import DocumentUpload from "./DocumentUpload";

export default function AddFarm({
  onSaved,
  back,
}) {
  const [loading, setLoading] = useState(false);

  const [farm, setFarm] = useState({
    name: "",
    village: "",
    farm_address: "",
    acres: "",
    state: "",
    district: "",
    taluka: "",
  });

  const [documents, setDocuments] = useState([]);

  const updateField = (key, value) => {
    setFarm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function uploadDocument(file, khetId, userId) {
    if (!file) return;

    const fileName = `${userId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("khet-documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { error: dbError } = await supabase
      .from("khet_documents")
      .insert({
        khet_id: khetId,
        user_id: userId,
        file_name: file.name,
        storage_path: fileName,
      });

    if (dbError) throw dbError;
  }
  async function saveFarm() {
    try {
      setLoading(true);

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
        alert("Enter farm name.");
        return;
      }

      if (!farm.village.trim()) {
        alert("Enter village name.");
        return;
      }

      if (!farm.acres || Number(farm.acres) <= 0) {
        alert("Enter valid acres.");
        return;
      }

      const { data: insertedFarm, error: insertError } =
        await supabase
          .from("khets")
          .insert({
            user_id: user.id,
            name: farm.name,
            village: farm.village,
            farm_address: farm.farm_address,
            acres: Number(farm.acres),
            state: farm.state,
            district: farm.district,
            taluka: farm.taluka,
          })
          .select()
          .single();

      if (insertError) throw insertError;

      for (const file of documents) {
        await uploadDocument(
          file,
          insertedFarm.id,
          user.id
        );
      }

      alert("Farm added successfully.");

      if (onSaved) {
        onSaved(insertedFarm);
      }

    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to save farm.");
    } finally {
      setLoading(false);
    }
    return (
        <div className="max-w-2xl mx-auto p-6">

          <h2 className="text-2xl font-bold mb-6">
            Add Farm
          </h2>

          <input
            type="text"
            placeholder="Farm Name"
            value={farm.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            className="w-full border rounded p-3 mb-4"
          />

          <input
            type="text"
            placeholder="Village"
            value={farm.village}
            onChange={(e) =>
              updateField("village", e.target.value)
            }
            className="w-full border rounded p-3 mb-4"
          />

          <input
            type="text"
            placeholder="Farm Address"
            value={farm.farm_address}
            onChange={(e) =>
              updateField("farm_address", e.target.value)
            }
            className="w-full border rounded p-3 mb-4"
          />

          <input
            type="number"
            placeholder="Acres"
            value={farm.acres}
            onChange={(e) =>
              updateField("acres", e.target.value)
            }
            className="w-full border rounded p-3 mb-4"
          />

          <input
            type="text"
            placeholder="State"
            value={farm.state}
            onChange={(e) =>
              updateField("state", e.target.value)
            }
            className="w-full border rounded p-3 mb-4"
          />

          <input
            type="text"
            placeholder="District"
            value={farm.district}
            onChange={(e) =>
              updateField("district", e.target.value)
            }
            className="w-full border rounded p-3 mb-4"
          />

          <input
            type="text"
            placeholder="Taluka"
            value={farm.taluka}
            onChange={(e) =>
              updateField("taluka", e.target.value)
            }
            className="w-full border rounded p-3 mb-4"
          />

          <DocumentUpload
            files={documents}
            setFiles={setDocuments}
          />

          <div className="flex gap-3 mt-6">

            <button
              onClick={back}
              className="px-5 py-3 rounded bg-gray-300"
            >
              Back
            </button>

            <button
              onClick={saveFarm}
              disabled={loading}
              className="px-5 py-3 rounded bg-green-600 text-white"
            >
              {loading ? "Saving..." : "Save Farm"}
            </button>

          </div>

        </div>
      );
  }
