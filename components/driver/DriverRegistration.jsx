import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverRegistration() {

  const [driver,setDriver] = useState({
    name:"",
    phone:"",
    village:"",
    tractor_num:"",
    tractor_details:""
  });

  const [loading,setLoading] = useState(false);


  function handleChange(e){

    setDriver({
      ...driver,
      [e.target.name]:e.target.value
    });

  }



  async function submitDriver(){

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

      <h2>🚜 Driver Registration</h2>


      {
        Object.keys(driver).map((key)=>(

          <input

            key={key}

            name={key}

            placeholder={key}

            value={driver[key]}

            onChange={handleChange}

            style={{
              width:"100%",
              padding:12,
              marginBottom:10
            }}

          />

        ))
      }



      <button

        onClick={submitDriver}

        disabled={loading}

        style={{
          padding:14,
          width:"100%",
          background:"#16a34a",
          color:"#fff",
          border:"none",
          borderRadius:10
        }}

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
