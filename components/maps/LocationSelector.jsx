import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LocationSelector({ onSelect }) {

  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [searchVillage, setSearchVillage] = useState("");

  const [loading, setLoading] = useState(false);



  useEffect(() => {
    loadTalukas();
  }, []);



  async function loadTalukas(){

    const {data,error}=await supabase
      .from("villages")
      .select("taluka");


    if(error){
      console.log(error);
      return;
    }


    setTalukas(
      [...new Set(
        data.map(x=>x.taluka)
      )].sort()
    );

  }




  async function loadVillages(t){

    const {data,error}=await supabase
      .from("villages")
      .select("village")
      .eq("taluka",t)
      .order("village");


    if(error){
      console.log(error);
      return;
    }


    setVillages(data || []);

  }




  function saveLocation(){

    if(!taluka || !village){

      alert("Please select Taluka and Village");

      return;

    }


    const data={

      state:"Maharashtra",

      district:"Chandrapur",

      taluka,

      village

    };


    localStorage.setItem(
      "location",
      JSON.stringify(data)
    );


    if(onSelect){
      onSelect(data);
    }

  }





  function useCurrentLocation(){

    setLoading(true);


    navigator.geolocation.getCurrentPosition(

      (p)=>{

        const data={

          state:"Maharashtra",

          district:"Chandrapur",

          latitude:p.coords.latitude,

          longitude:p.coords.longitude

        };


        if(onSelect){
          onSelect(data);
        }


        setLoading(false);

      },


      ()=>{

        alert("Location permission denied");

        setLoading(false);

      }

    );

  }




  useEffect(()=>{

    if(taluka){

      loadVillages(taluka);

      setVillage("");

      setSearchVillage("");

    }

  },[taluka]);





  return (

    <div

      style={{

        maxWidth:400,

        margin:"20px auto",

        padding:20,

        background:"#fff",

        borderRadius:10

      }}

    >


      <h2>
        📍 Select Farm Location
      </h2>


      <p>
        <b>State:</b> Maharashtra
      </p>


      <p>
        <b>District:</b> Chandrapur
      </p>




      <select

        value={taluka}

        onChange={(e)=>setTaluka(e.target.value)}

        style={{

          width:"100%",

          padding:10,

          marginBottom:10

        }}

      >

        <option value="">
          Select Taluka
        </option>


        {
          talukas.map(t=>(

            <option key={t} value={t}>

              {t}

            </option>

          ))
        }


      </select>





      <input

        value={searchVillage}

        disabled={!taluka}

        placeholder="Type Village Name"

        onChange={(e)=>{

          setSearchVillage(e.target.value);

          setVillage(e.target.value);

        }}

        style={{

          width:"100%",

          padding:10

        }}

      />





      {

        searchVillage &&

        <div

          style={{

            border:"1px solid #ccc",

            maxHeight:150,

            overflow:"auto"

          }}

        >

        {

          villages

          .filter(v=>

            v.village

            .toLowerCase()

            .includes(

              searchVillage.toLowerCase()

            )

          )

          .map(v=>(

            <div

              key={v.village}

              onClick={()=>{

                setVillage(v.village);

                setSearchVillage(v.village);

              }}

              style={{

                padding:10

              }}

            >

              {v.village}

            </div>

          ))

        }

        </div>

      }





      <button

        onClick={saveLocation}

        style={{

          width:"100%",

          marginTop:15,

          padding:12,

          background:"#16a34a",

          color:"#fff"

        }}

      >

        Save Location

      </button>





      <button

        onClick={useCurrentLocation}

        disabled={loading}

        style={{

          width:"100%",

          marginTop:10,

          padding:12,

          background:"#2563eb",

          color:"#fff"

        }}

      >

        📍 Use GPS

      </button>



    </div>

  );

}
