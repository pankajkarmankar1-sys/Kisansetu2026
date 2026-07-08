import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverList() {

  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadDrivers();

    const channel = supabase
      .channel("admin-drivers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          loadDrivers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  async function loadDrivers() {

    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "driver")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setDrivers(data || []);
    setLoading(false);
  }

  async function deleteDriver(id) {

    if (!window.confirm("Delete driver?")) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadDrivers();
  }

  const filteredDrivers = drivers.filter((driver) =>
    JSON.stringify(driver)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <h3>Loading Drivers...</h3>;
  }return (

    <div
      style={{
        background: "#fff",
        padding: 20,
        marginTop: 20,
        borderRadius: 12,
      }}
    >

      <h2>🚜 Driver Management</h2>

      <input
        type="text"
        placeholder="Search driver..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          margin: "15px 0",
          borderRadius: 8,
        }}
      />

      <button
        onClick={loadDrivers}
        style={{
          marginBottom: 15,
          padding: 10,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        🔄 Refresh
      </button>

      <table
        width="100%"
        border="1"
        cellPadding="8"
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredDrivers.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No drivers found.
              </td>
            </tr>
          ) : (
            filteredDrivers.map((driver) => (
              <tr key={driver.id}>

                <td>{driver.name || "-"}</td>

                <td>
                  {driver.phone ? (
                    <a href={`tel:${driver.phone}`}>
                      {driver.phone}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td>{driver.email || "-"}</td>

                <td>

                  <button
                    onClick={() => deleteDriver(driver.id)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    🗑 Delete
                  </button>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>

  );

}
  
