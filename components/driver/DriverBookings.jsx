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





  async function updateStatus(id,status){


    const {
      error
    } = await supabase
    .from("bookings")
    .update({

      status:status

    })
    .eq(
      "id",
      id
    );



    if(error){

      alert(error.message);
      return;

    }


    alert(
      "Status Updated"
    );


    loadBookings();


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
        🚜 My Assigned Bookings
      </h2>



      {
        bookings.length===0 &&

        <p>
          No booking assigned
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
            marginBottom:15

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
                marginTop:10,
                background:"#2563eb",
                color:"#fff",
                border:"none",
                borderRadius:10,
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
