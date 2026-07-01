import React from "react";
import { SVC } from "../../data/services";
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

  return (
    <div style={{ background:"#F8FAFC", minHeight:"100vh" }}>

      <div style={S.hdr}>
        <button style={S.bkb} onClick={back}>
          ← Back
        </button>

        <h2>🚜 Book Service</h2>

        <p>Select Farm • Service • Acres</p>
      </div>

      <div style={{ padding:15 }}>

        {selKhet && (
          <div style={S.card}>
            <h3>🌾 Selected Farm</h3>

            <p>{selKhet.name}</p>

            <p>
              {selKhet.selected712?.village || selKhet.village}
            </p>

            <p>
              {selKhet.selected712?.acres || selKhet.acres} Acre
            </p>
          </div>
        )}

        <div style={S.card}>
          <label>Total Acres</label>

          <input
            type="number"
            value={acres}
            onChange={(e)=>setAcres(e.target.value)}
          />
        </div>

        <div style={S.card}>

          <h3>Select Service</h3>

          {SVC.map((service)=>(
            <button
              key={service.id}
              onClick={()=>{
                setSelectedService(service);
                setPaymentDone(false);
              }}
            >
              {service.ico} {service.n}
            </button>
          ))}

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
