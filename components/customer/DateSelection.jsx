import React from "react";

export default function DateSelection({
  date,
  setDate,
  note,
  setNote,
  next,
  back,
}) {

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div
      style={{
        padding: 20,
        background: "#F8FAFC",
        minHeight: "100vh",
      }}
    >

      <h2>📅 Select Booking Date</h2>

      <div
        style={{
          background: "#fff",
          padding: 15,
          borderRadius: 12,
        }}
      >

        <label>
          Booking Date
        </label>

        <br />

        <input
          type="date"
          min={minDate.toISOString().split("T")[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: 10,
            width: "100%",
            marginTop: 10,
          }}
        />


        <br /><br />


        <textarea
          rows={4}
          placeholder="Customer Note (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
          }}
        />

      </div>


      <button
        onClick={back}
        style={{
          marginTop: 20,
          padding: 12,
        }}
      >
        ← Back
      </button>


      <button
        onClick={next}
        disabled={!date}
        style={{
          marginTop: 20,
          marginLeft: 10,
          padding: 12,
        }}
      >
        Continue →
      </button>

    </div>
  );
}
