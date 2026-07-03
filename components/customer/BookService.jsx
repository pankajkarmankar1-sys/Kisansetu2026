import React, { useState } from "react";

import ServiceSelection from "./booking/ServiceSelection";
import PaymentSummary from "./booking/PaymentSummary";
import DateSelection from "./booking/DateSelection";
import ConfirmBooking from "./ConfirmBooking";
import BookingSuccess from "./BookingSuccess";

export default function BookService({
  user,
  selKhet,
  setSelKhet,
  onNext,
  back,
}) {
  const [selectedService, setSelectedService] = useState(null);
  const [acres, setAcres] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);

  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [bookingData, setBookingData] = useState(null);

  const [step, setStep] = useState("service");

  return (
    <div>

      {step === "service" && (
        <ServiceSelection
          user={user}
          selKhet={selKhet}
          setSelKhet={setSelKhet}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          acres={acres}
          setAcres={setAcres}
          paymentDone={paymentDone}
          setPaymentDone={setPaymentDone}
          next={() => setStep("payment")}
          back={back}
        />
      )}

      {step === "payment" && (
        <PaymentSummary
          selectedService={selectedService}
          acres={acres}
          paymentDone={paymentDone}
          setPaymentDone={setPaymentDone}
          next={() => setStep("date")}
          back={() => setStep("service")}
        />
      )}

      {step === "date" && (
        <DateSelection
          date={date}
          setDate={setDate}
          note={note}
          setNote={setNote}
          next={() => {
            setBookingData({
              selectedService,
              acres,
              date,
              note,
            });
            setStep("confirm");
          }}
          back={() => setStep("payment")}
        />
      )}

      {step === "confirm" && (
        <ConfirmBooking
          bookingData={bookingData}
          onConfirm={() => setStep("success")}
          back={() => setStep("date")}
        />
      )}

      {step === "success" && (
        <BookingSuccess
          bookingData={bookingData}
          onDone={onNext}
        />
      )}

    </div>
  );
}
