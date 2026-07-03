import { useState } from "react";

export default function BookTractor() {
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");

  const handleBooking = () => {
    if (!crop || !area || !date) {
      alert("Please fill all fields");
      return;
    }

    alert("Booking Submitted Successfully!");

    console.log({
      crop,
      area,
      date,
    });
  };

  return (
    <div
      style={{
        maxWidth: 450,
        margin: "30px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 10,
        fontFamily: "Arial",
      }}
    >
      <h2>🚜 Book Tractor</h2>

      <div style={{ marginBottom: 15 }}>
        <label>Crop Name</label>
        <input
          type="text"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="e.g. Cotton"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Land Area (Acres)</label>
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Enter Acres"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Booking Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      <button
        onClick={handleBooking}
        style={{
          width: "100%",
          padding: 14,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Confirm Booking
      </button>
    </div>
  );
}
