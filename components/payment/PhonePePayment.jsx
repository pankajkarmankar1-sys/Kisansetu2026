import React, { useState } from "react";


export default function PhonePePayment({

  amount,
  onSuccess,
  onBack,

}) {


  const [loading,setLoading] = useState(false);



  async function startPayment(){


    try{


      setLoading(true);



      // Demo payment
      // Real PhonePe API integration later



      setTimeout(()=>{


        setLoading(false);



        alert(
          "✅ Payment Successful"
        );



        if(onSuccess){

          onSuccess();

        }


      },2000);



    }
    catch(err){


      console.log(err);


      setLoading(false);


    }


  }






  return (

    <div className="min-h-screen bg-green-50 p-5">


      <div className="bg-white rounded-3xl shadow p-6">


        <h1 className="text-2xl font-bold text-green-700">

          💳 Secure Payment

        </h1>



        <div className="bg-green-100 rounded-2xl p-5 mt-5">


          <p>

            Payment Amount

          </p>



          <h2 className="text-3xl font-bold">

            ₹{amount}

          </h2>


        </div>





        <div className="mt-5 bg-gray-100 rounded-xl p-4">


          <p>

            🟣 PhonePe

          </p>


          <p>

            🔒 Secure Payment

          </p>


        </div>







        <button

          onClick={startPayment}

          disabled={loading}

          className="w-full bg-green-600 text-white p-4 rounded-2xl mt-6 font-bold"


        >

          {

            loading

            ?

            "Processing..."

            :

            "Pay Now"

          }


        </button>






        <button

          onClick={onBack}

          className="w-full bg-gray-200 p-3 rounded-xl mt-3"

        >

          ← Back

        </button>




      </div>


    </div>

  );


}
