import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function ServiceSelection({

  user,
  selKhet,
  setSelectedService,
  selectedService,
  acres,
  setAcres,
  next,
  back,

}) {


  const [services,setServices] = useState([]);

  const [loading,setLoading] = useState(true);

  const [isSubscriber,setIsSubscriber] = useState(false);




  useEffect(()=>{

    loadServices();
    checkSubscription();

  },[]);





  async function loadServices(){


    const {
      data,
      error
    } = await supabase

    .from("services")

    .select("*")

    .eq(
      "active",
      true
    )

    .order("name");



    if(!error){

      setServices(data || []);

    }


    setLoading(false);

  }






  async function checkSubscription(){


    if(!user?.id)
      return;



    const {
      data
    } =
    await supabase

    .from("subscriptions")

    .select("id")

    .eq(
      "user_id",
      user.id
    )

    .eq(
      "status",
      "active"
    )

    .maybeSingle();



    setIsSubscriber(
      !!data
    );


  }
  return (

    <div className="min-h-screen bg-green-50 p-5">


      <div className="bg-white rounded-3xl shadow p-5">


        <button
          onClick={back}
          className="mb-4 bg-gray-200 px-4 py-2 rounded-xl"
        >
          ← Back
        </button>




        <h1 className="text-2xl font-bold text-green-700">

          🚜 Select Service

        </h1>






        {
          selKhet &&

          <div className="bg-green-100 rounded-2xl p-4 mt-4">

            🌾 Farm:

            <h3 className="font-bold">

              {selKhet.name}

            </h3>


            <p>

              📍 {selKhet.village}

            </p>


          </div>

        }







        <div className="bg-white border rounded-2xl p-4 mt-4">


          <h3 className="font-bold mb-2">

            📏 Acres

          </h3>



          <input

            type="number"

            value={acres}

            min="0.1"

            onChange={(e)=>
              setAcres(e.target.value)
            }

            className="w-full border rounded-xl p-3"

          />


        </div>







        <div className="mt-5">


          <h3 className="font-bold text-xl mb-3">

            🌱 Choose Service

          </h3>





          {
            loading

            ?

            <p>
              Loading services...
            </p>


            :


            services.map((service)=>(


              <button

                key={service.service_id}


                onClick={()=>{


                  const rate =

                  isSubscriber

                  ?

                  service.price_subscriber

                  :

                  service.price;




                  setSelectedService({

                    ...service,

                    selected_price:
                    Number(rate)

                  });


                }}


                className={`w-full text-left p-4 rounded-2xl mb-3 border ${
                  
                  selectedService?.service_id === service.service_id

                  ?

                  "border-green-600 bg-green-50"

                  :

                  "bg-white"

                }`}


              >


                <h3 className="font-bold">

                  {service.icon}

                  {" "}

                  {service.name_hi || service.name}

                </h3>




                <p>

                  💰 Rate:

                  {" "}

                  ₹{

                  isSubscriber

                  ?

                  service.price_subscriber

                  :

                  service.price

                  }

                  / Acre


                </p>




                {
                  isSubscriber &&

                  <span className="text-green-600 font-bold">

                    👑 50% OFF Subscription

                  </span>

                }



              </button>


            ))

          }


        </div>
        {
          selectedService &&

          <div className="bg-green-100 rounded-2xl p-5 mt-5">


            <h2 className="text-xl font-bold">

              📋 Booking Summary

            </h2>




            <p className="mt-3">

              Service:

              {" "}

              {selectedService.name_hi || selectedService.name}

            </p>




            <p>

              Rate:

              {" "}

              ₹{selectedService.selected_price}

              / Acre

            </p>




            <p>

              Acres:

              {" "}

              {acres}

            </p>






            <h2 className="text-2xl font-bold mt-3">

              Total:

              {" "}

              ₹{

                Number(acres || 0) *

                Number(selectedService.selected_price || 0)

              }

            </h2>



          </div>

        }







        <button


          onClick={()=>{


            if(!selKhet){

              alert(
                "Farm select kare"
              );

              return;

            }



            if(!selectedService){

              alert(
                "Service select kare"
              );

              return;

            }



            if(!acres){

              alert(
                "Acres enter kare"
              );

              return;

            }



            next();


          }}



          className="w-full bg-green-600 text-white p-4 rounded-2xl mt-6 font-bold text-lg"


        >

          Continue →

        </button>





      </div>


    </div>


  );

}
