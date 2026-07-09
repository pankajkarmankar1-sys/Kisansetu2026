import React from "react";


export default function SubscriptionPlans({
  onSelect,
  back,
}) {


  const plans = [

    {
      id:"monthly",
      name:"Monthly Plan",
      price:999,
      duration:"30 Days"
    },


    {
      id:"yearly",
      name:"Yearly Plan",
      price:9999,
      duration:"365 Days"
    }

  ];




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



      {
        plans.map((plan)=>(

          <div
            key={plan.id}
            style={{
              background:"#fff",
              padding:20,
              marginTop:15,
              borderRadius:12
            }}
          >


            <h3>
              {plan.name}
            </h3>


            <p>
              Validity: {plan.duration}
            </p>


            <h2>
              ₹{plan.price}
            </h2>



            <button

              onClick={()=>
                onSelect(plan)
              }

              style={{
                width:"100%",
                padding:12,
                background:"#16a34a",
                color:"#fff",
                border:"none",
                borderRadius:10
              }}

            >

              Subscribe Now

            </button>


          </div>

        ))
      }





      {
        back && (

          <button

            onClick={back}

            style={{
              width:"100%",
              padding:12,
              marginTop:20
            }}

          >

            ← Back

          </button>

        )
      }


    </div>

  );

}
