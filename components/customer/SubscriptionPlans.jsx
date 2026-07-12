import React from "react";


export default function SubscriptionPlans({
  farms = [],
  onSelect,
  back,
}) {



  const totalAcres = farms.reduce(
    (sum,farm)=>
      sum + Number(farm.acres || 0),
    0
  );



  const pricePerAcre = 550;



  const amount =
    totalAcres * pricePerAcre;




  return (


    <div className="min-h-screen bg-green-50 p-5">


      <div className="bg-white rounded-3xl shadow p-6">


        <h1 className="text-3xl font-bold text-green-700">

          👑 KisanSetu Subscription

        </h1>



        <p className="mt-3 text-gray-600">

          Aapke registered farms ke hisab se
          subscription automatically calculate hoga.

        </p>





        <div className="bg-green-100 rounded-2xl p-5 mt-5">


          <h3 className="font-bold text-xl">

            🌾 Total Farm Area

          </h3>


          <p className="text-3xl font-bold text-green-700">

            {totalAcres} Acre

          </p>


        </div>





        <div className="bg-yellow-100 rounded-2xl p-5 mt-4">


          <h3 className="font-bold">

            💰 Subscription Rate

          </h3>


          <p>

            ₹550 / Acre / Year

          </p>



          <h2 className="text-2xl font-bold mt-3">

            Pay Amount:
            ₹{amount}

          </h2>


        </div>






        <div className="bg-orange-100 rounded-2xl p-4 mt-4">


          🔥 Subscription Active hone ke baad

          <br/>

          🚜 Service booking par 50% OFF milega


        </div>







        <button

          onClick={()=>{


            if(totalAcres <= 0){

              alert(
                "Pehle Farm add kare"
              );

              return;

            }



            onSelect({

              acres:totalAcres,

              price:amount,

              duration:"365 Days"

            });


          }}


          className="w-full bg-green-600 text-white p-4 rounded-2xl mt-5 font-bold text-lg"

        >

          👑 Subscribe Now

        </button>







        {
          back &&

          <button

            onClick={back}

            className="w-full bg-gray-200 p-3 rounded-xl mt-3"

          >

            ← Back

          </button>

        }



      </div>


    </div>


  );

}
