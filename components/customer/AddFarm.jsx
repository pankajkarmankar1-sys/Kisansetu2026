import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import DocumentUpload from "./DocumentUpload";

export default function AddFarm({ onSaved, back }) {

  const [loading, setLoading] = useState(false);

  const [farm, setFarm] = useState({
    name: "",
    village: "",
    farm_address: "",
    acres: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFarm({
      ...farm,
      [e.target.name]: e.target.value,
    });
  };


  const getLocation = () => {

    if (!navigator.geolocation) {
      alert("GPS support nahi karta");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position)=>{

        setFarm({
          ...farm,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        alert("GPS Saved");

      },
      ()=>{
        alert("GPS permission allow karo");
      }
    );
  };


  async function saveFarm(){

    try {

      setLoading(true);


      const {
        data:{user},
        error:userError
      } = await supabase.auth.getUser();


      if(userError) throw userError;


      if(!user){
        alert("Login required");
        return;
      }


      if(
        !farm.name ||
        !farm.village ||
        !farm.acres
      ){
        alert("Farm name, village aur acres bharna jaruri hai");
        return;
      }



      const { data, error } = await supabase
      .from("khets")
      .insert([
        {
          user_id:user.id,
          name:farm.name,
          village:farm.village,
          farm_address:farm.farm_address,
          acres:Number(farm.acres),
          latitude:farm.latitude || null,
          longitude:farm.longitude || null
        }
      ])
      .select();



      if(error) throw error;


      alert("Farm Saved Successfully");


      if(onSaved){
        onSaved(data[0]);
      }


    } catch(error){

      console.log(error);
      alert(error.message);

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">
        Add Farm
      </h2>


      <input
      name="name"
      placeholder="Khet Name"
      value={farm.name}
      onChange={handleChange}
      className="border p-2 w-full mb-3"
      />


      <input
      name="village"
      placeholder="Village Name"
      value={farm.village}
      onChange={handleChange}
      className="border p-2 w-full mb-3"
      />


      <input
      name="acres"
      placeholder="Area Acres"
      type="number"
      value={farm.acres}
      onChange={handleChange}
      className="border p-2 w-full mb-3"
      />


      <input
      name="farm_address"
      placeholder="Farm Address"
      value={farm.farm_address}
      onChange={handleChange}
      className="border p-2 w-full mb-3"
      />


      <button
      onClick={getLocation}
      className="bg-green-600 text-white px-4 py-2 rounded mb-3"
      >
        Save GPS Location
      </button>


      <DocumentUpload />


      <div className="flex gap-3 mt-4">


      <button
      onClick={back}
      className="border px-4 py-2 rounded"
      >
        Back
      </button>


      <button
      onClick={saveFarm}
      disabled={loading}
      className="bg-blue-600 text-white px-5 py-2 rounded"
      >

      {loading ? "Saving..." : "Save Farm"}

      </button>


      </div>


    </div>

  );

}
