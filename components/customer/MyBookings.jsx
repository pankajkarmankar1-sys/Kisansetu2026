import { useEffect, useState } from "react";
import { sbGetAllBookings } from "../../lib/database";

export default function MyBookings({ phone }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const data = await sbGetAllBookings();

      const myBookings = data.filter(
        (b) => b.customer_phone === phone
      );

      setBookings(myBookings);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 My Bookings</h2>

      {bookings.length === 0 && (
        <p>No bookings found.</p>
      )}

      {bookings.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
          }}
        >
          <h3>{b.service_name}</h3>

          <p>🌾 Acres : {b.acres}</p>

          <p>📅 Date : {b.date}</p>

          <p>🚜 Status : {b.status}</p>

          <p>💰 Amount : ₹{b.amount}</p>
        </div>
      ))}
    </div>
  );
}
