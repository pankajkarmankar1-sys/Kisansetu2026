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

    try{

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
      .order(
        "name"
      );



      if(error)
        throw error;



      setServices(data || []);


    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  }





  async function checkSubscription(){


    if(!user?.id)
      return;


    const {
      data
    } = await supabase

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

            <b>
              {" "}
              {selKhet.name}
            </b>

            <p>
              📍 {selKhet.village}
            </p>

          </div>

        }






        <div className="mt-5">

          <h3 className="font-bold">
            📏 Enter Acres
          </h3>


          <input

            type="number"

            value={acres}

            onChange={(e)=>
              setAcres(e.target.value)
            }

            className="w-full border rounded-xl p-3 mt-2"

          />


        </div>






        <h3 className="font-bold text-xl mt-6 mb-3">
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


            <div

              key={service.id}


              onClick={()=>{


                const rate =

                isSubscriber

                ?

                service.price_subscriber

                :

                service.price;



                setSelectedService({

                  ...service,

                  selected_price:Number(rate)

                });


              }}


              className={

                `border rounded-2xl p-4 mb-3 cursor-pointer 

                ${
                selectedService?.id===service.id
                ?
                "bg-green-100 border-green-600"
                :
                "bg-white"
                }`

              }


            >

              <h3 className="font-bold">

                {service.icon}

                {" "}

                {service.name_hi || service.name}

              </h3>



              <p>

                💰 ₹

                {
                isSubscriber
                ?
                service.price_subscriber
                :
                service.price
                }

                / Acre

              </p>



            </div>


          ))

        }






        {
          selectedService &&

          <div className="bg-green-100 p-4 rounded-2xl mt-5">


            <h3 className="font-bold">
              📋 Summary
            </h3>


            <p>
              Service:
              {" "}
              {selectedService.name_hi || selectedService.name}
            </p>


            <p>
              Total:
              {" "}
              ₹
              {
              Number(acres || 0) *
              Number(selectedService.selected_price || 0)
              }
            </p>


          </div>

        }






        <button

          onClick={()=>{


            if(!selectedService){

              alert("Service select kare");
              return;

            }


            if(!acres){

              alert("Acres enter kare");
              return;

            }


            next();


          }}

          className="w-full bg-green-600 text-white p-4 rounded-2xl mt-6 font-bold"

        >

          Continue →

        </button>




      </div>


    </div>


  );

}
