import React, { useState } from "react";


export default function SubscriptionPlans({
  onSelect,
  back,
}) {


  const [acres,setAcres] = useState("");



  const pricePerAcre = 550;



  const amount =
    Number(acres || 0) * pricePerAcre;





  return (

    <div
      style={{
        padding:20,
        background:"#F8FAFC",
        minHeight:"100vh"
      }}
    >


      <h2>
        👑 KisanSetu Subscription
      </h2>




      <h3>
        ₹550 / Acre / Year
      </h3>




      <p>
        Subscription lene par service booking me 50% discount milega.
      </p>




      <input

        type="number"

        placeholder="Enter Farm Acres"

        value={acres}

        onChange={(e)=>
          setAcres(e.target.value)
        }

        style={{

          width:"100%",

          padding:12,

          marginTop:15,

          borderRadius:8,

          border:"1px solid #ccc"

        }}

      />





      <h2>
        Pay Amount: ₹{amount}
      </h2>





      <button

        onClick={()=>{


          if(!acres){

            alert(
              "Please enter acres"
            );

            return;

          }


          onSelect({

            acres:Number(acres),

            price:amount,

            duration:"365 Days"

          });


        }}


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

        👑 Subscribe Now

      </button>





      {
        back &&

        <button

          onClick={back}

          style={{

            width:"100%",

            padding:12,

            marginTop:15

          }}

        >

          ← Back

        </button>

      }



    </div>

  );

}
