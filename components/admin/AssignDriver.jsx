import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AssignDriver({ booking }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(
    booking?.driver_id || ""
  );

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "driver")
      .order("name");

    if (!error) {
      setDrivers(data || []);
    }
  }

  async function assignDriver() {
    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }

    const driver = drivers.find((d) => d.id === selectedDriver);

    const { error } = await supabase
      .from("bookings")
      .update({
        driver_id: driver.id,
        driver_name: driver.name,
        status: "Accepted",
      })
      .eq("id", booking.id);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Driver assigned successfully");
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
