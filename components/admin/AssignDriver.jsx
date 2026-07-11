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

    const {data,error}=await supabase
    .from("drivers")
    .select(`
      id,
      name,
      phone,
      auth_user_id
    `)
    .eq("approved",true)
    .order("name");


    if(error){
      console.log(error.message);
      return;
    }


    setDrivers(data || []);

  }




  async function assignDriver(){

    if(!selectedDriver){

      alert("Select Driver");
      return;

    }


    const driver =
    drivers.find(
      d=>d.id==selectedDriver
    );


    if(!driver){

      alert("Driver not found");
      return;

    }


    setLoading(true);



    const {error}=await supabase
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



    if(error){

      alert(error.message);
      setLoading(false);
      return;

    }



    if(driver.auth_user_id){

      await supabase
      .from("notifications")
      .insert({

        user_id:driver.auth_user_id,

        title:"🚜 New Booking Assigned",

        message:
        `${booking.service_name} booking assigned`

      });

    }



    alert("✅ Driver Assigned");

    setLoading(false);

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

      >

        <option value="">
          Select Driver
        </option>


        {
          drivers.map(d=>(

            <option
            key={d.id}
            value={d.id}
            >

              {d.name} - {d.phone}

            </option>

          ))
        }


      </select>



      <button
      onClick={assignDriver}
      disabled={loading}
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
