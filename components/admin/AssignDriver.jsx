import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AssignDriver({ booking }) {

  const [drivers,setDrivers] = useState([]);
  const [selectedDriver,setSelectedDriver] = useState("");
  const [loading,setLoading] = useState(false);


  useEffect(()=>{
    loadDrivers();
  },[]);



  async function loadDrivers(){

    const {
      data,
      error
    } = await supabase
    .from("drivers")
    .select(`
      id,
      auth_user_id,
      name,
      phone
    `)
    .eq("approval_status","approved")
    .order("name");


    if(error){

      console.log(error.message);
      return;

    }


    setDrivers(data || []);

  }





  async function assignDriver(){

    try{


      if(!booking?.id){

        alert("Booking not found");
        return;

      }


      if(!selectedDriver){

        alert("Select Driver");
        return;

      }


      const driver =
      drivers.find(
        d=>d.id === selectedDriver
      );



      if(!driver){

        alert("Driver not found");
        return;

      }



      setLoading(true);



      const {
        error
      } = await supabase

      .from("bookings")

      .update({

        driver_id:driver.id,

        driver_name:driver.name,

        driver_phone:driver.phone,

        status:"Assigned"

      })

      .eq(
        "id",
        booking.id
      );




      if(error)
        throw error;



      alert("✅ Driver Assigned");



    }
    catch(err){

      alert(err.message);

    }
    finally{

      setLoading(false);

    }

  }





  return (

    <div
      style={{
        display:"flex",
        gap:10
      }}
    >

      <select

        value={selectedDriver}

        onChange={(e)=>
          setSelectedDriver(e.target.value)
        }

        style={{
          flex:1,
          padding:10
        }}

      >

        <option value="">
          Select Driver
        </option>


        {
          drivers.map(driver=>(

            <option
              key={driver.id}
              value={driver.id}
            >

              {driver.name} - {driver.phone}

            </option>

          ))
        }


      </select>



      <button

        onClick={assignDriver}

        disabled={loading}

        style={{
          padding:"10px 15px",
          background:"#16a34a",
          color:"#fff",
          border:"none",
          borderRadius:8
        }}

      >

        {
          loading
          ?
          "Assigning..."
          :
          "Assign"
        }

      </button>


    </div>

  );

}
