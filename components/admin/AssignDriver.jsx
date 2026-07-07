import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AssignDriver({ booking }) {

  const [drivers,setDrivers] = useState([]);
  const [selectedDriver,setSelectedDriver] = useState("");
  const [loading,setLoading] = useState(false);



  useEffect(()=>{
    loadDrivers();
  },[]);



  useEffect(()=>{

    setSelectedDriver(
      booking?.driver_id || ""
    );

  },[booking]);





  async function loadDrivers(){

    const {
      data,
      error
    } = await supabase
      .from("profiles")
      .select("*")
      .eq(
        "role",
        "driver"
      )
      .order(
        "name"
      );


    if(!error){

      setDrivers(data || []);

    }

  }






  async function assignDriver(){


    if(!selectedDriver){

      alert(
        "Please select driver"
      );

      return;

    }



    const driver =
      drivers.find(
        d=>d.id===selectedDriver
      );



    if(!driver){

      alert(
        "Driver not found"
      );

      return;

    }



    try{


      setLoading(true);



      const {
        error
      } = await supabase
        .from("bookings")
        .update({

          driver_id:
            driver.id,

          driver_name:
            driver.name,

          driver_phone:
            driver.phone || "",

          status:
            "Accepted",

        })
        .eq(
          "id",
          booking.id
        );



      if(error)
        throw error;






      // Driver notification

      await supabase
      .from("notifications")
      .insert([

        {

          user_id:
            driver.id,

          title:
            "🚜 New Booking Assigned",

          message:
            `${booking.service_name} booking on ${booking.booking_date || "date"} assigned to you.`,

          created_at:
            new Date().toISOString(),

        }

      ]);







      // Customer notification

      if(booking.customer_id){


        await supabase
        .from("notifications")
        .insert([

          {

            user_id:
              booking.customer_id,

            title:
              "🚜 Driver Assigned",

            message:
              `${driver.name} will handle your booking. Contact: ${driver.phone || "Not available"}`,

            created_at:
              new Date().toISOString(),

          }

        ]);


      }





      alert(
        "✅ Driver Assigned"
      );



    }catch(err){

      console.error(
        err
      );

      alert(
        err.message
      );


    }finally{

      setLoading(false);

    }

  }






  return(

    <div
      style={{
        display:"flex",
        gap:8,
      }}
    >

      <select

        value={selectedDriver}

        onChange={(e)=>
          setSelectedDriver(
            e.target.value
          )
        }

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

              {driver.name}

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
