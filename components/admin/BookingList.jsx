import React, { useEffect, useState } from "react";
import AssignDriver from "./AssignDriver";
import { supabase } from "../../lib/supabase";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBookings();

    const channel = supabase
      .channel("admin-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        loadBookings
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBookings(data || []);
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (!error) loadBookings();
  }

  async function deleteBooking(id) {
    if (!window.confirm("Delete booking?")) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (!error) loadBookings();
  }

  const filtered = bookings.filter((b) =>
    JSON.stringify(b)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
      }}
    >
      <h2>📋 Booking Management</h2>

      <input
        placeholder="Search booking..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          margin: "15px 0",
        }}
      />

      <table
        width="100%"
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Driver</th>
            <th>Assign</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((booking) => (
            <tr key={booking.id}>
              <td>
                {booking.customer_name ||
                  booking.customer_phone ||
                  "-"}
              </td>

              <td>{booking.service_name}</td>

              <td>
                {booking.booking_date || booking.date}
              </td>

              <td>{booking.status}</td>

              <td>
                {booking.driver_name || "Not Assigned"}
              </td>

              <td>
                <AssignDriver booking={booking} />
              </td>

              <td>
                <button
                  onClick={() =>
                    updateStatus(
                      booking.id,
                      "Completed"
                    )
                  }
                >
                  ✅ Complete
                </button>

                <button
                  style={{ marginLeft: 8 }}
                  onClick={() =>
                    updateStatus(
                      booking.id,
                      "Cancelled"
                    )
                  }
                >
                  ❌ Cancel
                </button>

                <button
                  style={{ marginLeft: 8 }}
                  onClick={() =>
                    deleteBooking(booking.id)
                  }
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
