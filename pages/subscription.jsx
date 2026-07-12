import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PhonePePayment from "../components/payment/PhonePePayment";
import { supabase } from "../lib/supabase";


export default function SubscriptionPage(){


  const router = useRouter();


  const [farms,setFarms] = useState([]);

  const [amount,setAmount] = useState(0);

  const [totalAcres,setTotalAcres] = useState(0);

  const [payment,setPayment] = useState(false);



  const pricePerAcre = 550;



  useEffect(()=>{

    loadFarms();

  },[]);





  async function loadFarms(){


    const {
      data:{
        user
      }
    } =
    await supabase.auth.getUser();



    if(!user){

      router.replace("/login");

      return;

    }




    const {
      data
    } =
    await supabase

    .from("khets")

    .select("acres")

    .eq(
      "user_id",
      user.id
    );



    const acres =
    (data || []).reduce(

      (sum,item)=>
      sum + Number(item.acres || 0),

      0

    );



    setFarms(data || []);

    setTotalAcres(acres);

    setAmount(
      acres * pricePerAcre
    );


  }






  async function paymentSuccess(){


    try{


      const {
        data:{
          user
        }
      } =
      await supabase.auth.getUser();




      const startDate =
      new Date();



      const endDate =
      new Date();


      endDate.setFullYear(
        endDate.getFullYear()+1
      );





      const {
        error
      } =
      await supabase

      .from("subscriptions")

      .insert({

        user_id:user.id,

        acres:totalAcres,

        amount:amount,

        status:"active",

        start_date:startDate,

        end_date:endDate

      });




      if(error)
        throw error;




      alert(
        "✅ Subscription Activated"
      );



      router.replace("/dashboard");



    }
    catch(err){

      alert(
        err.message
      );

    }


  }







  if(payment){

    return (

      <PhonePePayment

        amount={amount}

        onSuccess={paymentSuccess}

        onBack={()=>setPayment(false)}

      />

    );

  }






  return (

    <div className="min-h-screen bg-green-50 p-5">


      <div className="bg-white rounded-3xl shadow p-6">


        <button
          onClick={()=>router.back()}
          className="mb-4"
        >

          ← Back

        </button>




        <h1 className="text-3xl font-bold text-green-700">

          👑 KisanSetu Subscription

        </h1>




        <div className="bg-green-100 rounded-2xl p-5 mt-5">


          🌾 Total Farm Area

          <h2 className="text-3xl font-bold">

            {totalAcres} Acre

          </h2>


        </div>





        <div className="bg-yellow-100 rounded-2xl p-5 mt-4">


          💰 Rate

          <h3>

            ₹550 / Acre / Year

          </h3>



          <h2 className="text-2xl font-bold">

            Pay ₹{amount}

          </h2>


        </div>






        <div className="bg-orange-100 p-4 rounded-xl mt-4">

          🔥 Subscription ke baad

          <br/>

          🚜 Service booking par 50% OFF milega

        </div>







        <button

          onClick={()=>{


            if(totalAcres<=0){

              alert(
                "Pehle farm add kare"
              );

              return;

            }


            setPayment(true);


          }}


          className="w-full bg-green-600 text-white p-4 rounded-2xl mt-5 font-bold"

        >

          👑 Buy Subscription

        </button>


      </div>


    </div>

  );


}
