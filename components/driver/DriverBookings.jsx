import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function DriverBookings({ driver }) {


  const [bookings,setBookings] = useState([]);

  const [loading,setLoading] = useState(true);




  useEffect(()=>{

    if(driver?.id){

      loadBookings();

    }

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

      .or(
        `driver_id.eq.${driver.id},driver_id.is.null`
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );





      if(error)
        throw error;




      setBookings(
        data || []
      );



    }
    catch(err){

      console.log(
        err.message
      );

    }
    finally{

      setLoading(false);

    }


  }







  async function updateStatus(id,status){


    try{


      const {
        error
      } = await supabase

      .from("bookings")

      .update({

        status:status,

        driver_id:
        driver.id

      })

      .eq(
        "id",
        id
      );





      if(error)
        throw error;





      alert(
        "✅ Booking Updated"
      );



      loadBookings();



    }
    catch(err){

      alert(
        err.message
      );

    }


  }








  if(loading){

    return (

      <div style={{padding:20}}>

        Loading Bookings...

      </div>

    );

  }







  return (

    <div

      style={{

        padding:15,

        background:"#f5f7fb",

        minHeight:"100vh"

      }}

    >



      <h2>
        🚜 Available Bookings
      </h2>





      {
        bookings.length===0 &&

        <p>
          No booking available
        </p>

      }







      {
        bookings.map((booking)=>(



          <div

          key={booking.id}

          style={{

            background:"#fff",

            padding:18,

            borderRadius:15,

            marginBottom:15,

            boxShadow:"0 2px 8px #ddd"

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
          📞 Mobile:
          {" "}
          {booking.customer_phone}
          </p>




          <p>
          📍 Village:
          {" "}
          {booking.village || "-"}
          </p>




          <p>
          🏠 Address:
          {" "}
          {booking.farm_address || "-"}
          </p>




          <p>
          🌾 Acres:
          {" "}
          {booking.acres}
          </p>




          <p>
          📅 Date:
          {" "}
          {booking.booking_date}
          </p>




          <p>
          📝 Note:
          {" "}
          {booking.note || "-"}
          </p>




          <p>
          💰 Amount:
          {" "}
          ₹{booking.amount}
          </p>




          <p>
          Status:
          {" "}
          <b>
          {booking.status}
          </b>
          </p>







          {
            booking.status==="Pending" &&


            <button

            onClick={()=>updateStatus(
              booking.id,
              "Accepted"
            )}

            style={{

              width:"100%",

              padding:12,

              background:"#16a34a",

              color:"#fff",

              border:"none",

              borderRadius:10,

              fontWeight:"bold"

            }}

            >

            ✅ Accept Booking

            </button>


          }







          {
            booking.status==="Accepted" &&


            <button

            onClick={()=>updateStatus(
              booking.id,
              "Completed"
            )}

            style={{

              width:"100%",

              padding:12,

              background:"#2563eb",

              color:"#fff",

              border:"none",

              borderRadius:10,

              marginTop:10,

              fontWeight:"bold"

            }}

            >

            🚜 Mark Completed

            </button>


          }







          </div>


        ))

      }





    </div>

  );

}
