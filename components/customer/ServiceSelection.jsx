 import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { S } from "../../styles";


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


  const [services,setServices] =
    useState([]);


  const [loading,setLoading] =
    useState(true);


  const [isSubscriber,setIsSubscriber] =
    useState(false);





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



      setServices(
        data || []
      );


    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  }









  async function checkSubscription(){


    try{


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
    catch(err){

      console.log(err);

    }


  }








  const price = selectedService

  ?

  (

    isSubscriber

    ?

    Number(
      selectedService.price_subscriber || 0
    )

    :

    Number(
      selectedService.price || 0
    )

  )

  :

  0;





  const total =

    Number(acres || 0)

    *

    price;








  return (

    <div
      style={{
        padding:20,
        background:"#F8FAFC",
        minHeight:"100vh"
      }}
    >


      <button onClick={back}>
        ← Back
      </button>



      <h2>
        🚜 Select Service
      </h2>



      {
        selKhet &&

        <div style={S.card}>

          <h3>
            🌾 Farm
          </h3>

          <p>
            {selKhet.name}
          </p>


        </div>

      }







      <div style={S.card}>


        <h3>
          🌱 Acres
        </h3>


        <input

          type="number"

          value={acres}

          min="0.1"

          onChange={(e)=>
            setAcres(e.target.value)
          }

          style={{
            width:"100%",
            padding:12
          }}

        />


      </div>








      <div style={S.card}>


        <h3>
          Choose Service
        </h3>




        {
          loading

          ?

          <p>
            Loading...
          </p>


          :


          services.map(service=>(


            <button


              key={service.service_id}


              onClick={()=>{

                setSelectedService(service);

              }}



              style={{

                width:"100%",

                padding:15,

                marginBottom:10,

                textAlign:"left",

                borderRadius:10,

                border:

                selectedService?.service_id === service.service_id

                ?

                "2px solid green"

                :

                "1px solid #ddd"

              }}



            >


              <b>

                {service.icon}

                {" "}

                {service.name_hi || service.name}

              </b>



              <br/>

              ₹

              {

                isSubscriber

                ?

                service.price_subscriber

                :

                service.price

              }


              {

                isSubscriber

                ?

                " / Acre (Subscriber)"

                :

                " / Acre (Normal)"

              }


            </button>


          ))

        }


      </div>









      {
        selectedService &&


        <div style={S.card}>


          <h3>
            Summary
          </h3>


          <p>
            Service:
            {" "}
            {selectedService.name_hi}
          </p>


          <p>
            Rate:
            {" "}
            ₹{price}/Acre
          </p>


          <p>
            Acres:
            {" "}
            {acres}
          </p>



          <h2>
            Total ₹{total}
          </h2>



        </div>

      }








      <button

        onClick={next}

        disabled={
          !selKhet ||
          !selectedService ||
          !acres
        }


        style={S.btnG}

      >

        Continue →

      </button>



    </div>

  );

}
