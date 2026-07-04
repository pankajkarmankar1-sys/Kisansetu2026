import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AssignDriver({ bookingId, currentDriver }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(
    currentDriver || ""
  );

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
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

    const driver = drivers.find(
      (d) => d.name === selectedDriver
    );

    const { error } = await supabase
      .from("bookings")
      .update({
        driver_name: driver.name,
        driver_id: driver.id,
        status: "assigned",
      })
      .eq("id", bookingId);

    if (error) {
      alert("Failed to assign driver");
    } else {
      alert("Driver assigned successfully");
    }
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
      >
        <option value="">Select Driver</option>

        {drivers.map((driver) => (
          <option key={driver.id} value={driver.name}>
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
