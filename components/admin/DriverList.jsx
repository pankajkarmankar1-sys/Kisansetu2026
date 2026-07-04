import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setDrivers(data || []);
    }
  }

  async function addDriver() {
    if (!name || !phone) {
      alert("Enter driver name and phone");
      return;
    }

    const { error } = await supabase
      .from("drivers")
      .insert({
        name,
        phone,
      });

    if (!error) {
      setName("");
      setPhone("");
      loadDrivers();
    }
  }

  async function deleteDriver(id) {
    const { error } = await supabase
      .from("drivers")
      .delete()
      .eq("id", id);

    if (!error) {
      loadDrivers();
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        marginTop: 20,
        borderRadius: 10,
      }}
    >
      <h2>🚜 Driver List</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Driver Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginLeft: 10 }}
        />

        <button
          onClick={addDriver}
          style={{ marginLeft: 10 }}
        >
          Add Driver
        </button>
      </div>

      <table
        border="1"
        cellPadding="8"
        width="100%"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name}</td>
              <td>{driver.phone}</td>

              <td>
                <button
                  onClick={() => deleteDriver(driver.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
