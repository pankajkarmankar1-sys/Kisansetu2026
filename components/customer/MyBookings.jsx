import React, { useState, useEffect } from "react";
import DriverBookingCard from "./DriverBookingCard";
import { supabase } from "../../lib/supabase";
import { sbGetAllBookings } from "../supabase/bookings"; // path apne project ke hisaab se check kar lena

export default function MyBookings({ phone }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_phone", phone)
      .order("created_at", { ascending: false });

    if (error) throw error;

    setBookings(data || []);
  } catch (err) {
    console.error(err);
  }
}
      setBookings(myBookings);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <DriverBookingCard
            key={b.id}
            booking={b}
          />
        ))
      )}
    </div>
  );
}
