// components/maps/LocationSelector.jsx

import React, { useState } from "react";


export default function LocationSelector({

  onSelect

}) {


  const [state, setState] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [loading, setLoading] =
    useState(false);



  const states = [

    "Maharashtra",

    "Madhya Pradesh",

    "Uttar Pradesh",

    "Bihar",

    "Rajasthan",

    "Gujarat",

    "Karnataka",

    "Tamil Nadu",

    "West Bengal",

    "Delhi",

  ];




  function saveLocation(data) {

    localStorage.setItem(
      "location",
      JSON.stringify(data)
    );


    if(onSelect){

      onSelect(data);

    }

  }





  function handleSave(){

    if(!state || !district){

      alert(
        "State और District select करें"
      );

      return;

    }


    saveLocation({

      state,

      district,

    });

  }





  function useCurrentLocation(){


    if(!navigator.geolocation){

      alert(
        "GPS available नहीं है"
      );

      return;

    }


    setLoading(true);


    navigator.geolocation.getCurrentPosition(

      (position)=>{


        const data = {

          latitude:
          position.coords.latitude,

          longitude:
          position.coords.longitude,

        };


        saveLocation(data);


        setLoading(false);


      },


      ()=>{

        alert(
          "Location permission denied"
        );

        setLoading(false);

      }

    );

  }





  return (

    <div

      style={{

        maxWidth:400,

        margin:"20px auto",

        padding:20,

        border:"1px solid #ddd",

        borderRadius:10,

        background:"#fff",

      }}

    >

      <h2>
        📍 Select Farm Location
      </h2>



      <select

        value={state}

        onChange={
          e=>setState(e.target.value)
        }

        style={{

          width:"100%",

          padding:10,

          marginBottom:10,

        }}

      >

        <option value="">
          Select State
        </option>


        {
          states.map((s)=>(

            <option
              key={s}
              value={s}
            >
              {s}
            </option>

          ))
        }


      </select>




      <input

        value={district}

        onChange={
          e=>setDistrict(e.target.value)
        }

        placeholder="Enter District"

        style={{

          width:"100%",

          padding:10,

          marginBottom:10,

        }}

      />




      <button

        onClick={handleSave}

        style={{

          width:"100%",

          padding:12,

          background:"#16a34a",

          color:"#fff",

          border:"none",

          borderRadius:8,

        }}

      >

        Save Location

      </button>




      <button

        onClick={useCurrentLocation}

        disabled={loading}

        style={{

          width:"100%",

          padding:12,

          marginTop:10,

          background:"#2563eb",

          color:"#fff",

          border:"none",

          borderRadius:8,

        }}

      >

        {loading ? "Getting GPS..." : "📍 Use GPS"}

      </button>


    </div>

  );

}
