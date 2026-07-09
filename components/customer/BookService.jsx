import React, { useState } from "react";

import ServiceSelection from "./ServiceSelection";
import FarmSelection from "./FarmSelection";
import PaymentSummary from "./PaymentSummary";
import DateSelection from "./DateSelection";
import ConfirmBooking from "./ConfirmBooking";
import BookingSuccess from "./BookingSuccess";


export default function BookService({
  user,
  selKhet,
  setSelKhet,
  onNext,
  back,
}) {


  const [selectedService,setSelectedService] =
    useState(null);


  const [acres,setAcres] =
    useState("");


  const [paymentDone,setPaymentDone] =
    useState(false);


  const [date,setDate] =
    useState("");


  const [note,setNote] =
    useState("");


  const [bookingData,setBookingData] =
    useState(null);


  const [step,setStep] =
    useState("farm");





  return (

    <div>


      {
        step==="farm" &&

        <FarmSelection

          user={user}

          selKhet={selKhet}

          setSelKhet={setSelKhet}

          next={()=>
            setStep("service")
          }

          back={back}

        />

      }






      {
        step==="service" &&

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

          next={()=>
            setStep("payment")
          }

          back={()=>
            setStep("farm")
          }

        />

      }








      {
        step==="payment" &&

        <PaymentSummary


          user={user}


          selectedService={selectedService}


          acres={acres}


          paymentDone={paymentDone}


          setPaymentDone={setPaymentDone}


          next={()=>
            setStep("date")
          }


          back={()=>
            setStep("service")
          }


        />

      }









      {
        step==="date" &&

        <DateSelection


          date={date}


          setDate={setDate}


          note={note}


          setNote={setNote}



          next={()=>{


            setBookingData({

              user,

              selectedService,

              acres,

              date,

              note,

              selKhet,


              payment_status:

                paymentDone

                ?

                "Paid"

                :

                "Pending"

            });



            setStep("confirm");


          }}



          back={()=>
            setStep("payment")
          }


        />

      }









      {
        step==="confirm" &&


        <ConfirmBooking
  user={user}
  bookingData={bookingData}
  onConfirm={(savedBooking) => {
    setBookingData(savedBooking);
    setStep("success");
  }}
  back={() => setStep("date")}
/>
      }









      {
        step==="success" &&


        <BookingSuccess


          bookingData={bookingData}


          onDone={onNext}


        />

      }





    </div>

  );

}
