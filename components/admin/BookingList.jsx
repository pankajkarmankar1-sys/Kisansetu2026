import React, { useEffect, useState } from "react";
import AssignDriver from "./AssignDriver";
import { supabase } from "../../lib/supabase";


export default function BookingList(){


  const [bookings,setBookings] = useState([]);

  const [search,setSearch] = useState("");





  useEffect(()=>{


    loadBookings();



    const channel = supabase

    .channel(
      "admin-bookings"
    )

    .on(

      "postgres_changes",

      {

        event:"*",

        schema:"public",

        table:"bookings"

      },

      ()=>{

        loadBookings();

      }

    )

    .subscribe();





    return ()=>{

      supabase.removeChannel(channel);

    };


  },[]);









  async function loadBookings(){


    const {

      data,

      error

    } = await supabase

    .from("bookings")

    .select("*")

    .order(

      "created_at",

      {
        ascending:false
      }

    );




    if(!error){

      setBookings(data || []);

    }


  }









  async function updateStatus(
    booking,
    status
  ){


    try{


      const {

        error

      } = await supabase

      .from("bookings")

      .update({

        status

      })

      .eq(

        "id",

        booking.id

      );





      if(error)
        throw error;







      if(booking.customer_id){


        await supabase

        .from("notifications")

        .insert([{

          user_id:
            booking.customer_id,


          title:
            `Booking ${status}`,


          message:
            `Your booking status is ${status}`


        }]);


      }







      if(booking.driver_id){


        const {

          data:driver

        } = await supabase

        .from("profiles")

        .select("auth_user_id")

        .eq(

          "id",

          booking.driver_id

        )

        .maybeSingle();






        if(driver?.auth_user_id){


          await supabase

          .from("notifications")

          .insert([{

            user_id:
              driver.auth_user_id,


            title:
              `Booking ${status}`,


            message:
              `Booking updated to ${status}`


          }]);

        }


      }






      loadBookings();


    }
    catch(err){


      console.log(err);

      alert(err.message);


    }


  }









  async function deleteBooking(id){


    if(
      !window.confirm(
        "Delete booking?"
      )
    )
    return;






    const {

      error

    } = await supabase

    .from("bookings")

    .delete()

    .eq(

      "id",

      id

    );






    if(error){

      alert(error.message);

      return;

    }



    loadBookings();


  }









  const filtered =

  bookings.filter((b)=>

    JSON.stringify(b)

    .toLowerCase()

    .includes(

      search.toLowerCase()

    )

  );








  return (

    <div

      style={{

        background:"#fff",

        padding:20,

        borderRadius:12

      }}

    >



      <h2>
        📋 Booking Management
      </h2>





      <input

        placeholder="Search booking..."

        value={search}

        onChange={(e)=>
          setSearch(e.target.value)
        }

        style={{

          width:"100%",

          padding:10,

          margin:"15px 0"

        }}

      />







      {
        filtered.map((booking)=>(


          <div

            key={booking.id}

            style={{

              padding:15,

              marginBottom:15,

              border:"1px solid #ddd",

              borderRadius:10

            }}

          >



            <h3>
              {booking.service_name}
            </h3>



            <p>
              Customer:
              {" "}
              {booking.customer_name ||
              booking.customer_phone ||
              "-"}
            </p>



            <p>
              Date:
              {" "}
              {booking.booking_date ||
              booking.date ||
              "-"}
            </p>



            <p>
              Status:
              {" "}
              {booking.status}
            </p>



            <p>
              Driver:
              {" "}
              {booking.driver_name ||
              "Not Assigned"}
            </p>






            <AssignDriver
              booking={booking}
            />





            <div
              style={{
                marginTop:15
              }}
            >


              <button
                onClick={()=>
                  updateStatus(
                    booking,
                    "Completed"
                  )
                }
              >
                ✅ Complete
              </button>





              <button

                style={{
                  marginLeft:10
                }}

                onClick={()=>
                  updateStatus(
                    booking,
                    "Cancelled"
                  )
                }

              >

                ❌ Cancel

              </button>





              <button

                style={{
                  marginLeft:10
                }}

                onClick={()=>
                  deleteBooking(
                    booking.id
                  )
                }

              >

                🗑 Delete

              </button>


            </div>



          </div>


        ))
      }



    </div>

  );

}
