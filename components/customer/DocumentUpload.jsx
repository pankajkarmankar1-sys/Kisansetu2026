import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DocumentUpload({
  khetId,
  onDone,
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  function selectFiles(e) {
    setFiles(Array.from(e.target.files || []));
  }

  async function uploadDocuments() {
    try {
      setLoading(true);

      if (files.length === 0) {
        alert("Please select at least one document.");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        alert("Login required");
        return;
      }

      if (!khetId) {
        alert("Farm not found.");
        return;
      }

      for (const file of files) {
        const path = `${user.id}/${khetId}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("khet-documents")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("khet-documents")
          .getPublicUrl(path);

        const { error: dbError } = await supabase
          .from("khet_documents")
          .insert({
            khet_id: khetId,
            user_id: user.id,
            document_type: "7/12",
            document_name: file.name,
            file_url: path,
            document_url: publicUrl,
          });

        if (dbError) {
          await supabase.storage
            .from("khet-documents")
            .remove([path]);

          throw dbError;
        }
      }

      alert("✅ Documents uploaded successfully.");

      if (onDone) {
        onDone();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-50 p-5">
      <div className="bg-white rounded-3xl shadow p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700">
          📄 Upload Documents
        </h2>

        <input
          type="file"
          multiple
          accept=".pdf,image/*"
          onChange={selectFiles}
          className="w-full mt-5 border p-3 rounded-xl"
        />

        <button
          onClick={uploadDocuments}
          disabled={loading}
          className="w-full mt-5 bg-green-600 text-white p-4 rounded-xl font-bold"
        >
          {loading ? "Uploading..." : "Upload 7/12 Documents"}
        </button>
      </div>
    </div>
  );
}
