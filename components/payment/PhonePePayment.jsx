import React, { useState } from "react";


export default function PhonePePayment({
  amount,
  onSuccess,
  onBack,
}) {


  const [loading,setLoading] = useState(false);



  async function startPayment(){


    try{


      setLoading(true);



      // Temporary testing payment
      // Real PhonePe gateway integration baad me add karenge


      setTimeout(()=>{


        setLoading(false);



        alert(
          "✅ Payment Successful"
        );



        if(onSuccess){

          onSuccess();

        }



      },2000);



    }
    catch(error){


      console.log(error);


      setLoading(false);


      alert(
        "❌ Payment Failed"
      );


    }


  }






  return (

    <div
      style={{
        padding:20,
        background:"#fff",
        borderRadius:12,
      }}
    >


      <h2>
        💳 PhonePe Payment
      </h2>



      <h3>
        Amount: ₹{amount}
      </h3>




      <button

        onClick={startPayment}

        disabled={loading}

        style={{

          width:"100%",

          padding:15,

          background:"#16a34a",

          color:"#fff",

          border:"none",

          borderRadius:10,

          fontSize:18

        }}

      >

        {
          loading
          ?
          "Processing..."
          :
          "Pay Now"
        }


      </button>





      {
        onBack &&

        <button

          onClick={onBack}

          disabled={loading}

          style={{

            width:"100%",

            padding:12,

            marginTop:10

          }}

        >

          ← Back

        </button>

      }




    </div>

  );

}
