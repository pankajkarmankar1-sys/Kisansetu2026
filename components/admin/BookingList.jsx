import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setBookings(data || []);
    }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (!error) {
      loadBookings();
    }
  }

  async function deleteBooking(id) {
    const ok = window.confirm("Delete this booking?");

    if (!ok) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (!error) {
      loadBookings();
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
      }}
    >
      <h2>📋 Booking List</h2>

      <table
        border="1"
        cellPadding="8"
        width="100%"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Customer</th>
            <th>Location</th>
            <th>Date</th>
            <th>Status</th>
            <th>Driver</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.user_name}</td>
              <td>{booking.location}</td>
              <td>{booking.date}</td>

              <td>{booking.status || "Pending"}</td>

              <td>{booking.driver_name || "Not Assigned"}</td>

              <td>
                <button
                  onClick={() =>
                    updateStatus(booking.id, "approved")
                  }
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(booking.id, "rejected")
                  }
                >
                  Reject
                </button>

                <button
                  onClick={() => deleteBooking(booking.id)}
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
