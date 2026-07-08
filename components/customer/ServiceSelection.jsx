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


  useEffect(() => {
    loadServices();
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


  return (
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
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
            <div style={{ padding: 15 }}>


        {selKhet && (

          <div style={S.card}>

            <h3>
              🌾 Selected Farm
            </h3>


            <p>
              {selKhet.name}
            </p>


            <p>
              {selKhet.selected712?.village || selKhet.village}
            </p>


            <p>
              {selKhet.selected712?.acres || selKhet.acres} Acre
            </p>


          </div>

        )}



        <div style={S.card}>

          <label>
            Total Acres
          </label>


          <input
            type="number"
            value={acres}
            onChange={(e) =>
              setAcres(e.target.value)
            }
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

            ) : (

              services.map((service) => (

                <button

                  key={service.service_id}

                  onClick={() => {

                    setSelectedService(service);

                    setPaymentDone(false);

                  }}

                  style={{
                    display: "block",
                    width: "100%",
                    marginBottom: 10,
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background:
                      selectedService?.service_id === service.service_id
                        ? "#dcfce7"
                        : "#fff",
                  }}

                >

                  {service.icon}
                  {" "}
                  {service.name_hi || service.name}

                  <br />

                  <small>
                    ₹{service.price_subscriber} (Subscriber)
                    {" | "}
                    ₹{service.price} (Normal)
                  </small>


                </button>

              ))

            )
          }


        </div>
                      <button

          style={S.btnG}

          disabled={!selectedService}

          onClick={next}

        >

          Continue →

        </button>



      </div>

    </div>
  );

}
