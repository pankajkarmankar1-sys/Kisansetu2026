import React, { useState } from "react";
import { SVC } from "../../data/services";
import { S } from "../../styles";
import { DB } from "../../utils/db";

export default function BookService({
  user,
  selKhet,
  setSelKhet,
  onNext,
  back,
}) {

  // =========================
  // STATES
  // =========================

  const [sel, setSel] = useState(null);
  const [acStr, setAcStr] = useState("");
  const [paid, setPaid] = useState(false);

  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [err, setErr] = useState("");

  const [paying, setPaying] = useState(false);

  const [step, setStep] = useState("book");

  // Part 2 se code yaha continue hoga

  return (
    <div>

      <h2>Book Service</h2>

    </div>
  );

}
// ==============================
// BOOKING CALCULATION
// ==============================

const subAc = parseFloat(user?.sA || 0);

const selDocAcres =
  selKhet?.selected712?.acres ||
  selKhet?.khetAcres ||
  null;

const ac = selDocAcres
  ? parseFloat(selDocAcres)
  : (parseFloat(acStr) || 1);

const isDisc =
  user?.sub && subAc >= ac;

const sp = (s) =>
  Math.round(s.sub * ac);

const np = (s) =>
  Math.round(s.norm * ac);

const amt = sel
  ? (isDisc ? sp(sel) : np(sel))
  : 0;

const min = new Date();

min.setDate(min.getDate() + 1);
// ==============================
// PAYMENT (Demo)
// ==============================

const doPay = () => {

  if (!sel) {
    setErr("Please select service");
    return;
  }

  setPaying(true);

  setTimeout(() => {

    setPaying(false);

    setPaid(true);

    setStep("date");

  },1800);

};

// ==============================
// CONFIRM
// ==============================

const doConfirm = () => {

  if (!paid) {

    setErr("Complete payment first");

    return;

  }

  if (!date) {

    setErr("Select booking date");

    return;

  }

  onNext({

    service: sel,

    acres: ac,

    amount: amt,

    payment_status: "paid",

    date,

    note,

    khet: selKhet,

  });

};
return (
  <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>

    <div style={S.hdr}>
      <button style={S.bkb} onClick={back}>
        ← Back
      </button>

      <h1>🚜 Book Service</h1>

      <p>Select Farm • Service • Payment</p>
    </div>

    <div style={{ padding: 15 }}>

      {/* Selected Farm */}

      {selKhet && (

        <div style={S.card}>

          <h3>🌾 Selected Farm</h3>

          <p>{selKhet.name}</p>

          <p>
            {selKhet.selected712?.village ||
              selKhet.village}
          </p>

          <p>

            {selKhet.selected712?.acres ||
              selKhet.acres}

            Acre

          </p>

        </div>

      )}

      {/* Acres */}

      <div style={S.card}>

        <label>Total Acres</label>

        <input

          type="number"

          value={acStr}

          onChange={(e) =>
            setAcStr(e.target.value)
          }

        />

      </div>

      {/* Services */}

      <div style={S.card}>

        <h3>Select Service</h3>

        {SVC.map((s) => (

          <button

            key={s.id}

            onClick={() => {

              setSel(s);

              setErr("");

            }}

          >

            {s.ico}

            {" "}

            {s.n}

            {" "}

            ₹{isDisc ? sp(s) : np(s)}

          </button>

        ))}

      </div>

      {/* Payment */}

      {sel && (

        <div style={S.card}>

          <h3>Payment Summary</h3>

          <p>Amount : ₹{amt}</p>

          <button

            onClick={doPay}

            disabled={paying}

          >

            {paying

              ? "Processing..."

              : `Pay ₹${amt}`}

          </button>

        </div>

      )}

    </div>

  </div>
);
// ==============================
// DATE SCREEN
// ==============================

if (step === "date") {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", padding: 20 }}>

      <h2>📅 Select Booking Date</h2>

      <input
        type="date"
        min={min.toISOString().split("T")[0]}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <textarea
        rows={4}
        placeholder="Customer Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br /><br />

      {err && (
        <p style={{ color: "red" }}>
          {err}
        </p>
      )}

      <button onClick={doConfirm}>
        ✅ Confirm Booking
      </button>

    </div>
  );
}
onNext({
  service: sel,
  acres: ac,
  amount: amt,
  payment_status: "paid",
  booking_status: "pending",
  driver_status: "waiting",
  date,
  note,
  khet: selKhet,
  createdAt: new Date().toISOString(),
});
components/customer/

BookService.jsx          ✅ Done

ConfirmBooking.jsx       ← Next

BookingSuccess.jsx       ← Next

MyBookings.jsx

NotificationBell.jsx

NotificationPanel.jsx
