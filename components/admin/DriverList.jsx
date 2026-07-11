import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function DriverList() {


  const [drivers,setDrivers] = useState([]);

  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");






  useEffect(()=>{


    loadDrivers();


    const channel = supabase

    .channel("admin-drivers")

    .on(

      "postgres_changes",

      {

        event:"*",

        schema:"public",

        table:"profiles"

      },

      ()=>{

        loadDrivers();

      }

    )

    .subscribe();




    return ()=>{

      supabase.removeChannel(channel);

    };


  },[]);








  async function loadDrivers(){


    try{


      setLoading(true);



      const {
        data,
        error
      } = await supabase

      .from("profiles")

      .select("*")

      .eq(
        "role",
        "driver"
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );





      if(error)
        throw error;



      setDrivers(data || []);



    }
    catch(err){

      alert(err.message);

    }
    finally{

      setLoading(false);

    }


  }









  async function updateStatus(
    id,
    status
  ){


    const {
      error
    } = await supabase

    .from("profiles")

    .update({

      document_status:
      status,


      verified_at:
      status==="approved"
      ?
      new Date()
      :
      null

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
      `Driver ${status}`
    );


    loadDrivers();


  }








  async function deleteDriver(id){


    if(
      !confirm("Delete driver?")
    )
    return;




    await supabase

    .from("profiles")

    .delete()

    .eq(
      "id",
      id
    );



    loadDrivers();


  }








  const filtered = drivers.filter(
    d=>

    JSON.stringify(d)

    .toLowerCase()

    .includes(
      search.toLowerCase()
    )

  );







  if(loading){

    return (
      <h3>
        Loading Drivers...
      </h3>
    );

  }







  return (

    <div
      style={{
        background:"#fff",
        padding:20,
        borderRadius:12
      }}
    >



      <h2>
        🚜 Driver Management
      </h2>





      <input

        placeholder="Search driver..."

        value={search}

        onChange={
          e=>setSearch(e.target.value)
        }

        style={{
          width:"100%",
          padding:12,
          marginBottom:15
        }}

      />








      {
        filtered.map(driver=>(


          <div

          key={driver.id}

          style={{

            border:"1px solid #ddd",

            padding:15,

            marginBottom:15,

            borderRadius:10

          }}

          >



          <h3>
            {driver.name || "-"}
          </h3>



          <p>
            📞 {driver.phone || "-"}
          </p>



          <p>
            🚜 Tractor:
            {" "}
            {driver.tractor_num || "-"}
          </p>



          <p>
            Status:
            {" "}
            {driver.document_status || "pending"}
          </p>





          {
            driver.document_status !== "approved" &&

            <button

              onClick={()=>updateStatus(
                driver.id,
                "approved"
              )}

              style={{

                background:"#16a34a",

                color:"#fff",

                padding:10,

                border:"none",

                borderRadius:8,

                marginRight:10

              }}

            >

              ✅ Approve

            </button>

          }





          {
            driver.document_status !== "rejected" &&

            <button

              onClick={()=>updateStatus(
                driver.id,
                "rejected"
              )}

              style={{

                background:"#dc2626",

                color:"#fff",

                padding:10,

                border:"none",

                borderRadius:8

              }}

            >

              ❌ Reject

            </button>

          }





          <button

            onClick={()=>deleteDriver(driver.id)}

            style={{

              marginLeft:10,

              padding:10

            }}

          >

            🗑 Delete

          </button>




          </div>


        ))

      }





    </div>

  );

}
