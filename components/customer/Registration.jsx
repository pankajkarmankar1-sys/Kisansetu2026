import { useState } from "react";
import { supabase } from "../lib/supabase";

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
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      setLoading(false);

      // save + redirect
      onDone &&
        onDone({
          phone,
          name,
          farm,
          district,
        });

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

        {back && (
          <button type="button" onClick={back} style={{ marginLeft: 10 }}>
            Back
          </button>
        )}
      </form>
    </div>
  );
}
