import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error loading bookings:", error.message);
    } else {
      setBookings(data);
    }

    setLoading(false);
  }

  async function deleteBooking(id) {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (!error) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧑‍🌾 Admin Dashboard</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Location</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user_name}</td>
                <td>{b.location}</td>
                <td>{b.date}</td>
                <td>
                  <button
                    onClick={() => deleteBooking(b.id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
