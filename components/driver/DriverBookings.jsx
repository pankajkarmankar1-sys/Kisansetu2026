import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function DriverBookings({ driver }) {


  const [bookings,setBookings] = useState([]);

  const [loading,setLoading] = useState(true);





  useEffect(()=>{


    if(!driver?.id)
      return;


    loadBookings();



    const channel = supabase

    .channel(
      `driver_bookings_${driver.id}`
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









  async function updateStatus(
    booking,
    status
  ){


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





    if(error){

      alert(error.message);

      return;

    }







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






    loadBookings();


  }







  if(loading){

    return <h3>Loading Bookings...</h3>;

  }






  return (

    <div>


      <h2>
        🚜 My Bookings
      </h2>





      {
        bookings.length===0 && (

          <p>
            No bookings assigned.
          </p>

        )
      }





      {
        bookings.map((booking)=>(


          <div

            key={booking.id}

            style={{

              background:"#fff",

              padding:15,

              marginBottom:15,

              borderRadius:10

            }}

          >



            <h3>
              {booking.service_name}
            </h3>



            <p>
              Customer:
              {" "}
              {booking.customer_name || "-"}
            </p>



            <p>
              Phone:
              {" "}
              {booking.customer_phone || "-"}
            </p>



            <p>
              Village:
              {" "}
              {booking.village || "-"}
            </p>



            <p>
              Status:
              {" "}
              {booking.status}
            </p>







            {
              booking.status==="Pending" && (

                <button
                  onClick={()=>updateStatus(
                    booking,
                    "Accepted"
                  )}
                >
                  ✅ Accept
                </button>

              )
            }





            {
              booking.status==="Accepted" && (

                <button
                  onClick={()=>updateStatus(
                    booking,
                    "In Progress"
                  )}
                >
                  🚜 Start Work
                </button>

              )
            }





            {
              booking.status==="In Progress" && (

                <button
                  onClick={()=>updateStatus(
                    booking,
                    "Completed"
                  )}
                >
                  ✅ Complete
                </button>

              )
            }





            <button

              onClick={()=>updateStatus(
                booking,
                "Rejected"
              )}

              style={{

                marginLeft:10

              }}

            >

              ❌ Reject

            </button>





            {
              booking.customer_phone && (

                <a

                  href={
                    `tel:${booking.customer_phone}`
                  }

                  style={{

                    marginLeft:10

                  }}

                >

                  📞 Call

                </a>

              )
            }





          </div>


        ))

      }



    </div>

  );

}
