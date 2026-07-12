import React, { useState, useEffect } from "react";
import DriverBookingCard from "./DriverBookingCard";
import BookingDetailsModal from "./BookingDetailsModal";
import { supabase } from "../../lib/supabase";


export default function MyBookings() {


  const [bookings,setBookings] = useState([]);

  const [loading,setLoading] = useState(true);

  const [selectedBooking,setSelectedBooking] = useState(null);





  useEffect(()=>{

    loadBookings();


    const channel = supabase

    .channel("customer-bookings")

    .on(

      "postgres_changes",

      {
        event:"*",
        schema:"public",
        table:"bookings",
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


    try{


      setLoading(true);



      const {
        data:{
          user
        }

      } = await supabase.auth.getUser();





      if(!user){

        setBookings([]);

        return;

      }







      const {

        data,

        error

      } = await supabase

      .from("bookings")

      .select(`

        id,
        booking_code,
        service_name,
        booking_date,
        status,
        amount,
        total_amount,
        payment_status,

        customer_name,
        customer_phone,

        farm_name,
        farm_address,

        village,
        district,
        taluka,

        acres,
        note,

        driver_name,
        driver_phone,

        created_at

      `)

      .eq(

        "customer_id",

        user.id

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
        "Booking Error:",
        err.message
      );


    }

    finally{


      setLoading(false);


    }


  }








  async function cancelBooking(id){



    const ok = window.confirm(

      "Cancel this booking?"

    );



    if(!ok)

      return;







    const {

      error

    } = await supabase

    .from("bookings")

    .update({

      status:"Cancelled"

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

      "✅ Booking Cancelled"

    );



    loadBookings();


  }







  if(loading){


    return (

      <h2>

        Loading bookings...

      </h2>

    );


  }







  return (


    <div

      style={{

        padding:20,

        background:"#f0fdf4",

        minHeight:"100vh"

      }}

    >



      <h1>

        📋 My Bookings

      </h1>






      <button

        onClick={loadBookings}

        style={{

          padding:12,

          background:"#16a34a",

          color:"#fff",

          border:"none",

          borderRadius:10,

          marginBottom:20

        }}

      >

        🔄 Refresh

      </button>







      {

      bookings.length===0

      ?

      (

        <p>

          No bookings found

        </p>

      )

      :

      bookings.map((booking)=>(


        <DriverBookingCard


          key={booking.id}


          booking={booking}


          onView={(data)=>

            setSelectedBooking(data)

          }


          onCancel={cancelBooking}


        />


      ))


      }







      <BookingDetailsModal


        booking={selectedBooking}


        onClose={()=>


          setSelectedBooking(null)


        }


      />





    </div>


  );


}
