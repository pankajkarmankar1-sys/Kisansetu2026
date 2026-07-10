import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LocationSelector({ onSelect }) {

  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    loadTalukas();

  }, []);




  async function loadTalukas() {

    const { data, error } =
      await supabase

      .from("villages")

      .select("taluka");


    if(error){

      console.log(error);

      return;

    }


    const uniqueTalukas =
      [
        ...new Set(
          data.map(item => item.taluka)
        )
      ];


    setTalukas(
      uniqueTalukas.sort()
    );

  }





  async function loadVillages(selectedTaluka) {


    const { data, error } =
      await supabase

      .from("villages")

      .select("village")

      .eq(
        "taluka",
        selectedTaluka
      )

      .order("village");



    if(error){

      console.log(error);

      return;

    }


    setVillages(data || []);

  }





  function saveLocation(data){


    localStorage.setItem(
      "location",
      JSON.stringify(data)
    );


    if(onSelect){

      onSelect(data);

    }

  }





  function handleSave(){


    if(!taluka || !village){

      alert(
        "Please select Taluka and Village"
      );

      return;

    }



    saveLocation({

      state:"Maharashtra",

      district:"Chandrapur",

      taluka,

      village

    });


  }





  function useCurrentLocation(){


    if(!navigator.geolocation){

      alert(
        "GPS is not available"
      );

      return;

    }



    setLoading(true);



    navigator.geolocation.getCurrentPosition(

      (position)=>{


        saveLocation({

          state:"Maharashtra",

          district:"Chandrapur",

          latitude:
          position.coords.latitude,

          longitude:
          position.coords.longitude

        });



        setLoading(false);


      },


      ()=>{


        alert(
          "Location permission denied"
        );


        setLoading(false);


      },


      {

        enableHighAccuracy:true,

        timeout:10000

      }

    );


  }





  useEffect(()=>{


    if(taluka){

      loadVillages(taluka);

      setVillage("");

    }

    else{

      setVillages([]);

    }


  },[taluka]);





  return (

    <div

      style={{

        maxWidth:400,

        margin:"20px auto",

        padding:20,

        border:"1px solid #ddd",

        borderRadius:10,

        background:"#fff"

      }}

    >


      <h2>
        📍 Select Farm Location
      </h2>




      <div>
        <strong>State:</strong> Maharashtra
      </div>



      <div style={{marginBottom:15}}>

        <strong>District:</strong> Chandrapur

      </div>




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

          talukas.map(item=>(

            <option

              key={item}

              value={item}

            >

              {item}

            </option>

          ))

        }


      </select>






      <input

        list="villageList"

        value={village}

        onChange={(e)=>
          setVillage(e.target.value)
        }

        disabled={!taluka}

        placeholder="Type or select Village"

        style={{

          width:"100%",

          padding:10,

          marginBottom:15

        }}

      />



      <datalist id="villageList">


        {

          villages.map(item=>(

            <option

              key={item.village}

              value={item.village}

            />

          ))

        }


      </datalist>






      <button

        onClick={handleSave}

        style={{

          width:"100%",

          padding:12,

          background:"#16a34a",

          color:"#fff",

          border:"none",

          borderRadius:8,

          marginBottom:10

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

          background:"#2563eb",

          color:"#fff",

          border:"none",

          borderRadius:8

        }}

      >

        {
          loading
          ?
          "Getting GPS..."
          :
          "📍 Use GPS"
        }


      </button>



    </div>

  );

}
