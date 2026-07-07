import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverBookings({ driver }) {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!driver?.id) return;

    loadBookings();


    const channel = supabase
      .channel(`driver_bookings_${driver.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          loadBookings();
        }
      )
      .subscribe();



    return () => {
      supabase.removeChannel(channel);
    };


  }, [driver]);




  async function loadBookings() {

    try {

      setLoading(true);


      const { data, error } =
        await supabase
          .from("bookings")
          .select("*")
          .or(
            `status.eq.Pending,driver_id.eq.${driver.id}`
          )
          .order(
            "created_at",
            {
              ascending:false,
            }
          );


      if(error) throw error;


      setBookings(data || []);


    } catch(err) {

      console.error(
        "Booking Load Error:",
        err
      );


    } finally {

      setLoading(false);

    }

  }





  async function updateStatus(
    booking,
    status
  ) {


    try {


      const update = {
        status,
      };



      if(status === "Accepted") {

        update.driver_id =
          driver.id;

        update.driver_name =
          driver.name || "";

        update.driver_phone =
          driver.phone || "";

      }




      const { error } =
        await supabase
          .from("bookings")
          .update(update)
          .eq(
            "id",
            booking.id
          );



      if(error) throw error;





      // Customer Notification

      if(booking.customer_id) {

        await supabase
          .from("notifications")
          .insert([
            {
              user_id:
                booking.customer_id,

              title:
                `🚜 Booking ${status}`,

              message:
                `Your booking status changed to ${status}.`,

              created_at:
                new Date().toISOString(),
            }
          ]);

      }





      alert(
        `✅ Booking ${status}`
      );


      loadBookings();



    } catch(err) {

      console.error(
        err
      );

      alert(
        err.message
      );

    }

  }





  if(!driver?.id){

    return (
      <div>
        Driver login nahi hai
      </div>
    );

  }




  if(loading){

    return (
      <h2>
        Loading...
      </h2>
    );

  }





  return (

    <div
      style={{
        padding:20,
      }}
    >


      <h2>
        🚜 Driver Bookings
      </h2>




      <button
        onClick={loadBookings}
        style={{
          marginBottom:20,
          padding:10,
        }}
      >
        🔄 Refresh
      </button>





      {
        bookings.length === 0 && (

          <p>
            Koi booking nahi hai
          </p>

        )
      }





      {
        bookings.map((b)=>(


          <div
            key={b.id}
            style={{
              background:"#fff",
              padding:15,
              marginBottom:15,
              borderRadius:12,
              boxShadow:
                "0 2px 8px rgba(0,0,0,.1)",
            }}
          >


            <h3>
              🚜 {b.service_name}
            </h3>


            <p>
              👤 Customer:
              {" "}
              {b.customer_name || "-"}
            </p>


            <p>
              📞 Phone:
              {" "}
              {b.customer_phone || "-"}
            </p>


            <p>
              🌾 Acres:
              {" "}
              {b.acres || 0}
            </p>


            <p>
              📅 Date:
              {" "}
              {b.booking_date || "-"}
            </p>


            <p>
              💰 Amount:
              {" "}
              ₹{b.amount || 0}
            </p>



            <p>
              📦 Status:
              {" "}
              <b>
                {b.status}
              </b>
            </p>





            {b.status === "Pending" && (

              <>

                <button
                  onClick={() =>
                    updateStatus(
                      b,
                      "Accepted"
                    )
                  }
                >
                  ✅ Accept
                </button>


                <button
                  style={{
                    marginLeft:10,
                  }}
                  onClick={() =>
                    updateStatus(
                      b,
                      "Rejected"
                    )
                  }
                >
                  ❌ Reject
                </button>


              </>

            )}






            {b.status === "Accepted" && (

              <button
                onClick={() =>
                  updateStatus(
                    b,
                    "In Progress"
                  )
                }
              >
                ▶️ Start Work
              </button>

            )}






            {b.status === "In Progress" && (

              <button
                onClick={() =>
                  updateStatus(
                    b,
                    "Completed"
                  )
                }
              >
                ✔️ Complete Work
              </button>

            )}




          </div>


        ))
      }



    </div>

  );

}
