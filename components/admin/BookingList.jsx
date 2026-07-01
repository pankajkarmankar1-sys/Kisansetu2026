import React from "react";

export default function BookingList({ bookings = [] }) {

  return (

    <div>

      <h2>📋 All Bookings</h2>

      {bookings.length === 0 ? (

        <p>No bookings available.</p>

      ) : (

        bookings.map((booking) => (

          <div
            key={booking.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              background: "#fff",
            }}
          >

            <h3>
              🚜 {booking.service_name || booking.serviceName}
            </h3>

            <p>👨 Customer : {booking.customer_name}</p>

            <p>📞 Phone : {booking.customer_phone}</p>

            <p>🌾 Acres : {booking.acres}</p>

            <p>📅 Date : {booking.date}</p>

            <p>💰 Amount : ₹{booking.amount}</p>

            <p>
              📦 Status :
              <b style={{ color: "#2d8a4e" }}>
                {" "}
                {booking.booking_status || "Pending"}
              </b>
            </p>

          </div>

        ))

      )}

    </div>

  );

}
