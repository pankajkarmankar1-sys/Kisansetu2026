import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AddFarm({
  user,
  onSaved,
  back,
}) {

  const [farm,setFarm] = useState({
    name:"",
    village:"",
    farm_address:"",
    acres:"",
    state:"",
    district:"",
    taluka:""
  });


  const [loading,setLoading] = useState(false);



  function handleChange(e){

    setFarm({
      ...farm,
      [e.target.name]: e.target.value
    });

  }



  async function saveFarm(){

    try{

      setLoading(true);


      const {
        data:{
          user:authUser
        }
      } = await supabase.auth.getUser();


      if(!authUser){

        alert("Login required");
        return;

      }



      const {
        error
      } = await supabase
      .from("khets")
      .insert([{

        user_id:authUser.id,

        name:farm.name,

        village:farm.village,

        farm_address:farm.farm_address,

        acres:Number(farm.acres),

        state:farm.state,

        district:farm.district,

        taluka:farm.taluka

      }]);



      if(error)
        throw error;



      alert("✅ Farm Added Successfully");


      if(onSaved){
        onSaved();
      }


    }
    catch(err){

      alert(err.message);

    }
    finally{

      setLoading(false);

    }

  }



  return (
    <div style={{padding:20}}>

      <h2>
        🌾 Add New Farm
      </h2><input
        name="name"
        placeholder="Khet Name"
        value={farm.name}
        onChange={handleChange}
        style={input}
      />


      <input
        name="village"
        placeholder="Village Name"
        value={farm.village}
        onChange={handleChange}
        style={input}
      />


      <input
        name="farm_address"
        placeholder="Farm Address"
        value={farm.farm_address}
        onChange={handleChange}
        style={input}
      />


      <input
        name="acres"
        type="number"
        placeholder="Total Acres"
        value={farm.acres}
        onChange={handleChange}
        style={input}
      />


      <input
        name="state"
        placeholder="State"
        value={farm.state}
        onChange={handleChange}
        style={input}
      />


      <input
        name="district"
        placeholder="District"
        value={farm.district}
        onChange={handleChange}
        style={input}
      />


      <input
        name="taluka"
        placeholder="Taluka"
        value={farm.taluka}
        onChange={handleChange}
        style={input}
      />



      <button

        onClick={saveFarm}

        disabled={loading}

        style={{
          width:"100%",
          padding:15,
          background:"#16a34a",
          color:"#fff",
          border:"none",
          borderRadius:10,
          fontSize:18,
          marginTop:15
        }}

      >

        {
          loading
          ?
          "Saving..."
          :
          "✅ Save Farm"
        }

      </button>



      <button

        onClick={back}

        style={{
          width:"100%",
          padding:12,
          marginTop:10
        }}

      >

        ← Back

      </button>


    </div>
  );

}



const input = {

  width:"100%",
  padding:12,
  marginBottom:12,
  borderRadius:8,
  border:"1px solid #ccc",
  fontSize:16

};
