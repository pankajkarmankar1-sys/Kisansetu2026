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
    <div style={{ padding: 20 }}>

      <h2>📅 Select Booking Date</h2>

      <input
        type="date"
        min={minDate.toISOString().split("T")[0]}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <textarea
        rows={4}
        placeholder="Customer Note (Optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br /><br />

      <button onClick={back}>
        ← Back
      </button>

      <button
        onClick={next}
        disabled={!date}
        style={{ marginLeft: 10 }}
      >
        Continue →
      </button>

    </div>
  );
}
