import React, { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function DriverProfile({ driver }) {


  const [status,setStatus] = useState(
    driver?.availability || "Available"
  );


  const [loading,setLoading] = useState(false);





  async function changeStatus(){


    if(!driver?.id){

      alert("Driver not found");

      return;

    }





    try{


      setLoading(true);




      const newStatus =

      status === "Available"

      ?

      "Busy"

      :

      "Available";






      const {
        error
      } = await supabase

      .from("profiles")

      .update({

        availability:newStatus,

        busy:
        newStatus === "Busy",

        updated_at:
        new Date().toISOString()

      })

      .eq(

        "id",

        driver.id

      );






      if(error)
        throw error;






      setStatus(newStatus);

      alert(
        "✅ Status Updated"
      );



    }
    catch(err){

      console.log(err);

      alert(
        err.message
      );

    }
    finally{

      setLoading(false);

    }


  }







  if(!driver){

    return (

      <h3>
        Loading Driver...
      </h3>

    );

  }








  return (

    <div

      style={{

        background:"#fff",

        padding:20,

        borderRadius:12,

        border:"1px solid #ddd"

      }}

    >



      <h2>
        👨‍🌾 Driver Profile
      </h2>





      <p>
        <b>Name:</b>{" "}
        {driver.name || "-"}
      </p>




      <p>
        <b>Phone:</b>{" "}
        {driver.phone || "-"}
      </p>




      <p>
        <b>Village:</b>{" "}
        {driver.village || "-"}
      </p>




      <p>
        <b>Tractor Number:</b>{" "}
        {driver.tractor_num || "-"}
      </p>




      <p>
        <b>Tractor Details:</b>{" "}
        {driver.tractor_details || "-"}
      </p>




      <p>
        <b>Status:</b>{" "}

        <span
          style={{
            color:
            status==="Available"
            ?
            "green"
            :
            "orange",

            fontWeight:"bold"
          }}
        >

          {status}

        </span>

      </p>






      <button

        onClick={changeStatus}

        disabled={loading}

        style={{

          padding:12,

          background:"#2563eb",

          color:"#fff",

          border:"none",

          borderRadius:10

        }}

      >

      {
        loading
        ?
        "Updating..."
        :
        "🔄 Change Status"
      }


      </button>





    </div>

  );

}
