import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AssignDriver({ booking }) {

  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {

    loadDrivers();

  }, []);



  useEffect(() => {

    if(booking){

      setSelectedDriver(
        booking.driver_id || ""
      );

    }

  }, [booking]);





  async function loadDrivers(){

    try{


      const {
        data,
        error
      } = await supabase

      .from("profiles")

      .select("*")

      .eq("role","driver")

      .order("name");



      if(error)
        throw error;



      setDrivers(data || []);



    }
    catch(err){

      console.log(err.message);

    }

  }






  async function assignDriver(){


    if(!booking?.id){

      alert("Booking not found");

      return;

    }



    if(!selectedDriver){

      alert("Please select driver");

      return;

    }



    const driver =
      drivers.find(
        d=>d.id===selectedDriver
      );



    if(!driver){

      alert("Driver not found");

      return;

    }




    try{


      setLoading(true);




      const {
        error
      } = await supabase

      .from("bookings")

      .update({

        driver_id:driver.id,

        driver_name:
        driver.name || "",

        driver_phone:
        driver.phone || "",

        status:"Assigned",

      })

      .eq("id",booking.id);




      if(error)
        throw error;





      await supabase

      .from("notifications")

      .insert([{

        user_id:driver.id,

        title:"🚜 New Booking Assigned",

        message:
        `New ${booking.service_name} booking assigned to you.`

      }]);






      if(booking.customer_id){


        await supabase

        .from("notifications")

        .insert([{

          user_id:booking.customer_id,

          title:"🚜 Driver Assigned",

          message:
          `${driver.name} assigned for your booking.`

        }]);

      }






      alert("✅ Driver Assigned Successfully");



    }
    catch(err){

      console.error(err);

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
        gap:10,
        alignItems:"center"
      }}
    >


      <select

        value={selectedDriver}

        onChange={(e)=>
          setSelectedDriver(e.target.value)
        }

        style={{
          padding:10,
          flex:1
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

            {driver.name || driver.phone}

          </option>

        ))
        }



      </select>




      <button

        onClick={assignDriver}

        disabled={loading}

        style={{

          padding:"10px 18px",

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
