import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { S } from "../../styles";

export default function ServiceSelection({
  user,
  selKhet,
  setSelKhet,
  selectedService,
  setSelectedService,
  acres,
  setAcres,
  paymentDone,
  setPaymentDone,
  next,
  back,
}) {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscriber, setIsSubscriber] = useState(false);


  useEffect(() => {
    loadServices();
    checkSubscription();
  }, []);


  async function loadServices() {

    try {

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("name");


      if (error) {
        console.log(error);
        return;
      }

      setServices(data || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }



  async function checkSubscription() {

    try {

      if (!user?.id) return;


      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();


      if (!error && data) {
        setIsSubscriber(true);
      }


    } catch (err) {

      console.log(err);

    }

  }



  const price =
    selectedService
      ? (
        isSubscriber
          ? Number(selectedService.price_subscriber || 0)
          : Number(selectedService.price || 0)
      )
      : 0;


  const totalAmount =
    Number(acres || 0) * price;



  return (

    <div
      style={{
        background:"#F8FAFC",
        minHeight:"100vh"
      }}
    >


      <div style={S.hdr}>

        <button
          style={S.bkb}
          onClick={back}
        >
          ← Back
        </button>


        <h2>
          🚜 Book Service
        </h2>


        <p>
          Select Farm • Service • Acres
        </p>

      </div>



      <div style={{padding:15}}>



        {!selKhet && (

          <div
            style={{
              background:"#FEF2F2",
              color:"#B91C1C",
              padding:12,
              borderRadius:8,
              marginBottom:15
            }}
          >

            ⚠️ Please select a farm first.

          </div>

        )}




        {selKhet && (

          <div style={S.card}>

            <h3>
              🌾 Selected Farm
            </h3>


            <p>
              <b>Name:</b> {selKhet.name}
            </p>


            <p>
              <b>Village:</b>{" "}
              {selKhet.selected712?.village || selKhet.village}
            </p>


            <p>
              <b>Total Farm:</b>{" "}
              {selKhet.selected712?.acres || selKhet.acres} Acre
            </p>


          </div>

        )}




        <div style={S.card}>


          <label>
            Booking Acres
          </label>


          <input

            type="number"

            min="0.1"

            step="0.1"

            placeholder="Enter Acres"

            value={acres}

            onChange={(e)=>{

              let value=e.target.value;


              const max =
                selKhet?.selected712?.acres ||
                selKhet?.acres;


              if(max && Number(value)>Number(max)){
                value=max;
              }


              setAcres(value);

            }}

          />


        </div>





        <div style={S.card}>


          <h3>
            Select Service
          </h3>



          {
            loading ? (

              <p>
                Loading services...
              </p>

            )

            :

            services.map((service)=>(


              <button

                key={service.service_id}

                onClick={()=>{

                  setSelectedService(service);

                  setPaymentDone(false);

                }}


                style={{

                  display:"block",

                  width:"100%",

                  marginBottom:10,

                  padding:12,

                  borderRadius:8,

                  border:
                  selectedService?.service_id === service.service_id
                  ?
                  "2px solid green"
                  :
                  "1px solid #ddd",


                  background:
                  selectedService?.service_id === service.service_id
                  ?
                  "#dcfce7"
                  :
                  "#fff",


                  textAlign:"left"

                }}

              >


                <b>
                  {service.icon}{" "}
                  {service.name_hi || service.name}
                </b>


                <br/>


                <small>

                  ₹
                  {
                    isSubscriber
                    ?
                    service.price_subscriber
                    :
                    service.price
                  }

                  {" / Acre "}


                  {
                    isSubscriber
                    ?
                    "(Subscriber)"
                    :
                    "(Normal)"
                  }


                </small>



              </button>


            ))

          }


        </div>





        {
          selectedService && (

            <div style={S.card}>


              <h3>
                Booking Summary
              </h3>


              <p>
                <b>Service:</b>{" "}
                {selectedService.name_hi || selectedService.name}
              </p>


              <p>
                <b>Rate:</b> ₹{price}/Acre
              </p>


              <p>
                <b>Acres:</b> {acres || 0}
              </p>


              <h2>
                💰 Total: ₹{totalAmount}
              </h2>


            </div>

          )
        }






        <button

          style={S.btnG}

          disabled={
            !selKhet ||
            !selectedService ||
            !acres ||
            Number(acres)<=0
          }


          onClick={next}

        >

          Continue →

        </button>




      </div>


    </div>

  );

}
