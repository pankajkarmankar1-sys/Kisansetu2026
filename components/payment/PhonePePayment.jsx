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



      /*
        Yaha PhonePe API connect hogi.
        Abhi testing ke liye success flow.
      */


      setTimeout(()=>{


        setLoading(false);



        if(onSuccess){

          onSuccess();

        }


      },2000);



    }
    catch(err){

      console.log(err);

      setLoading(false);

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
          padding:14,
          background:"#16a34a",
          color:"#fff",
          border:"none",
          borderRadius:10,
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
        onBack && (

          <button

            onClick={onBack}

            style={{
              width:"100%",
              padding:12,
              marginTop:10,
            }}

          >

            ← Back

          </button>

        )
      }




    </div>

  );

}
