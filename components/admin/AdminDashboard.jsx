import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadBookings();
    loadDrivers();
  }, []);

  async function loadBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookings(data);
  }

  async function loadDrivers() {
    const { data } = await supabase
      .from("drivers")
      .select("*");

    if (data) setDrivers(data);
  }

  async function assignDriver(bookingId, driverName) {
    const { error } = await supabase
      .from("bookings")
      .update({ driver_name: driverName, status: "assigned" })
      .eq("id", bookingId);

    if (!error) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, driver_name: driverName, status: "assigned" }
            : b
        )
      );
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧑‍🌾 Admin Dashboard</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>User</th>
            <th>Location</th>
            <th>Status</th>
            <th>Driver</th>
            <th>Assign Driver</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.user_name}</td>
              <td>{b.location}</td>
              <td>{b.status}</td>

              <td>
                {b.driver_name ? (
                  <b style={{ color: "blue" }}>{b.driver_name}</b>
                ) : (
                  "Not Assigned"
                )}
              </td>

              <td>
                <select
                  onChange={(e) =>
                    assignDriver(b.id, e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Driver
                  </option>

                  {drivers.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
