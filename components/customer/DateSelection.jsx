import React from "react";


export default function DateSelection({

  date,
  setDate,
  note,
  setNote,
  next,
  back,

}) {



  const minDate =
    new Date();


  minDate.setDate(
    minDate.getDate()+1
  );





  function handleNext(){


    if(!date){

      alert(
        "Booking date select kare"
      );

      return;

    }


    next();


  }







  return (

    <div className="min-h-screen bg-green-50 p-5">


      <div className="bg-white rounded-3xl shadow p-6">



        <h1 className="text-2xl font-bold text-green-700">

          📅 Select Booking Date

        </h1>




        <div className="mt-5 bg-green-100 rounded-2xl p-5">


          <label className="font-bold">

            🚜 Service Date

          </label>



          <input

            type="date"

            min={
              minDate
              .toISOString()
              .split("T")[0]
            }


            value={date}


            onChange={(e)=>
              setDate(e.target.value)
            }


            className="w-full mt-3 p-3 rounded-xl border"

          />


        </div>







        <div className="mt-5">


          <label className="font-bold">

            📝 Customer Note

          </label>


          <textarea


            rows="4"


            placeholder="Driver ke liye message (optional)"


            value={note}


            onChange={(e)=>
              setNote(e.target.value)
            }


            className="w-full mt-3 p-3 rounded-xl border"

          />


        </div>







        <div className="flex gap-3 mt-6">



          <button

            onClick={back}

            className="flex-1 bg-gray-200 p-3 rounded-xl font-bold"

          >

            ← Back

          </button>





          <button

            onClick={handleNext}

            disabled={!date}


            className={`flex-1 p-3 rounded-xl font-bold text-white ${
              
              date

              ?

              "bg-green-600"

              :

              "bg-gray-400"

            }`}

          >

            Continue →

          </button>




        </div>




      </div>



    </div>


  );

}
