import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverRegistration() {

  const [driver,setDriver] = useState({
    name:"",
    phone:"",
    village:"",
    tractor_num:"",
    tractor_details:"",
  });


  const [loading,setLoading] = useState(false);



  function handleChange(e){

    setDriver({
      ...driver,
      [e.target.name]:e.target.value
    });

  }



  async function registerDriver(){

    try{

      setLoading(true);


      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();



      if(!user){

        alert("Login required");
        return;

      }



      const {
        error
      } = await supabase

      .from("drivers")

      .insert([{

        auth_user_id:user.id,

        name:driver.name,

        phone:driver.phone,

        village:driver.village,

        tractor_num:driver.tractor_num,

        tractor_details:driver.tractor_details,

        role:"driver",

        approval_status:"pending",

        is_online:false,

        busy:false

      }]);



      if(error)
        throw error;



      alert("✅ Driver Registration Successful");


      setDriver({
        name:"",
        phone:"",
        village:"",
        tractor_num:"",
        tractor_details:""
      });


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
        🚜 Driver Registration
      </h2>


      <input
      name="name"
      placeholder="Driver Name"
      value={driver.name}
      onChange={handleChange}
      />


      <input
      name="phone"
      placeholder="Mobile Number"
      value={driver.phone}
      onChange={handleChange}
      />


      <input
      name="village"
      placeholder="Village"
      value={driver.village}
      onChange={handleChange}
      />


      <input
      name="tractor_num"
      placeholder="Tractor Number"
      value={driver.tractor_num}
      onChange={handleChange}
      />


      <input
      name="tractor_details"
      placeholder="Tractor Details"
      value={driver.tractor_details}
      onChange={handleChange}
      />



      <button
      onClick={registerDriver}
      disabled={loading}
      >

      {
        loading
        ?
        "Saving..."
        :
        "Register Driver"
      }

      </button>


    </div>

  );

}
