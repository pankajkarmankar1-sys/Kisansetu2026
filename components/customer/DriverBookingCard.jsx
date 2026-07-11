import React from "react";
import { S } from "../../styles";

export default function DriverBookingCard({
  booking,
  onView,
  onCancel,
}) {


  const status =
    booking?.status || "Pending";



  const statusColor = {

    Pending:"#f59e0b",

    Accepted:"#2563eb",

    "In Progress":"#9333ea",

    Completed:"#16a34a",

    Cancelled:"#dc2626",

    Rejected:"#dc2626",

  };




  return (

    <div

      style={{
        ...S.card,
        marginBottom:15,
        borderLeft:
        `6px solid ${
          statusColor[status] || "#16a34a"
        }`
      }}

    >



      <h3>
        🚜 {booking?.service_name || "Tractor Service"}
      </h3>





      <p>
        🆔 <b>Booking ID:</b>{" "}
        {booking?.booking_code || booking?.id}
      </p>





      <p>
        👨‍🌾 <b>Customer:</b>{" "}
        {booking?.customer_name || "-"}
      </p>





      <p>
        📞 <b>Mobile:</b>{" "}
        {booking?.customer_phone || "-"}
      </p>





      <hr />





      <h4>
        🌾 Farm Details
      </h4>



      <p>
        🌱 <b>Farm Name:</b>{" "}
        {booking?.farm_name || "-"}
      </p>



      <p>
        📍 <b>Village:</b>{" "}
        {booking?.village || "-"}
      </p>



      <p>
        🏡 <b>Address:</b>{" "}
        {booking?.farm_address || "-"}
      </p>



      <p>
        📌 <b>District:</b>{" "}
        {booking?.district || "-"}
      </p>



      <p>
        📌 <b>Taluka:</b>{" "}
        {booking?.taluka || "-"}
      </p>





      <hr />





      <p>
        🌾 <b>Acres:</b>{" "}
        {booking?.acres || 0}
      </p>




      <p>
        💰 <b>Amount:</b>{" "}
        ₹{booking?.amount || 0}
      </p>




      <p>
        💳 <b>Payment:</b>{" "}
        {booking?.payment_status || "Pending"}
      </p>




      <p>
        📦 <b>Status:</b>{" "}

        <span
          style={{
            color:
            statusColor[status],
            fontWeight:"bold"
          }}
        >
          {status}
        </span>

      </p>





      {
        booking?.note &&

        <p>
          📝 <b>Note:</b>{" "}
          {booking.note}
        </p>

      }






      <div

        style={{

          display:"flex",

          gap:10,

          marginTop:15,

          flexWrap:"wrap"

        }}

      >




        <button

          style={{
            ...S.btnG,
            flex:1
          }}

          onClick={()=>
            onView && onView(booking)
          }

        >

          👁 View Details

        </button>







        {
          status==="Pending" &&

          <button

            onClick={()=>
              onCancel &&
              onCancel(booking.id)
            }

            style={{

              flex:1,

              padding:14,

              border:"none",

              borderRadius:10,

              background:"#dc2626",

              color:"#fff"

            }}

          >

            ❌ Cancel

          </button>

        }






        {
          booking?.customer_phone &&

          <a

            href={
              `tel:${booking.customer_phone}`
            }

            style={{
              flex:1,
              textDecoration:"none"
            }}

          >

            <button

              style={{

                width:"100%",

                padding:14,

                border:"none",

                borderRadius:10,

                background:"#2563eb",

                color:"#fff"

              }}

            >

              📞 Call Farmer

            </button>


          </a>

        }





      </div>





    </div>

  );

}
