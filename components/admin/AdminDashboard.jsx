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

    if (!error) setBookings(data);

    setLoading(false);
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status } : b
        )
      );
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧑‍🌾 Admin Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>User</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user_name}</td>
                <td>{b.location}</td>
                <td>{b.date}</td>

                <td>
                  <b
                    style={{
                      color:
                        b.status === "approved"
                          ? "green"
                          : b.status === "rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {b.status}
                  </b>
                </td>

                <td>
                  <button
                    onClick={() => updateStatus(b.id, "approved")}
                    style={{
                      marginRight: 5,
                      background: "green",
                      color: "white",
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(b.id, "rejected")}
                    style={{
                      background: "red",
                      color: "white",
                    }}
                  >
                    Reject
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
