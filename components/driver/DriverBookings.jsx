import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function DriverBookings({ driver }) {

  const [bookings,setBookings] = useState([]);
  const [loading,setLoading] = useState(true);



  useEffect(()=>{

    if(!driver?.id)
      return;

    loadBookings();

  },[driver]);





  async function loadBookings(){

    try{

      setLoading(true);


      const {
        data,
        error
      } = await supabase

      .from("bookings")

      .select("*")

      .eq(
        "driver_id",
        driver.id
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );



      if(error)
        throw error;


      setBookings(data || []);


    }
    catch(err){

      console.log(err.message);

    }
    finally{

      setLoading(false);

    }

  }






  if(loading){

    return <h3>Loading Bookings...</h3>;

  }





  return (

    <div style={{padding:15}}>

      <h2>
        🚜 My Assigned Bookings
      </h2>



      {
        bookings.length === 0 &&

        <p>
          No assigned bookings.
        </p>

      }




      {
        bookings.map((booking)=>(

          <div

          key={booking.id}

          style={{

            background:"#fff",

            padding:15,

            marginBottom:15,

            borderRadius:12,

            border:"1px solid #ddd"

          }}

          >

            <h3>
              🚜 {booking.service_name}
            </h3>


            <p>
              👨‍🌾 Customer:
              {" "}
              {booking.customer_name}
            </p>


            <p>
              📞 Phone:
              {" "}
              {booking.customer_phone}
            </p>


            <p>
              🌾 Acres:
              {" "}
              {booking.acres}
            </p>


            <p>
              📍 Village:
              {" "}
              {booking.village || "-"}
            </p>


            <p>
              Status:
              {" "}
              {booking.status}
            </p>


          </div>

        ))

      }


    </div>

  );

}
