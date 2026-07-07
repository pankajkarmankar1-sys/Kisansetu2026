import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AssignDriver({ booking }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    setSelectedDriver(booking?.driver_id || "");
  }, [booking]);

  async function loadDrivers() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "driver")
        .order("name");

      if (error) throw error;

      setDrivers(data || []);
    } catch (err) {
      console.error("Load Drivers Error:", err);
    }
  }

  async function assignDriver() {
    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }

    const driver = drivers.find(
      (d) => d.id === selectedDriver
    );

    if (!driver) {
      alert("Driver not found");
      return;
    }

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          driver_id: driver.id,
          driver_name: driver.name,
          status: "Accepted",
        })
        .eq("id", booking.id);

      if (error) throw error;

      alert("✅ Driver assigned successfully");
    } catch (err) {
      console.error("Assign Driver Error:", err);
      alert(err.message);
    }
  }
    return (
    <div style={{ display: "flex", gap: 8 }}>
      <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
      >
        <option value="">Select Driver</option>

        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        ))}
      </select>

      <button onClick={assignDriver}>
        Assign
      </button>
    </div>
  );
}
