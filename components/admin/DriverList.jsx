import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverList() {

  const [drivers,setDrivers] = useState([]);
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");



  useEffect(()=>{

    loadDrivers();


    const channel =
      supabase
      .channel("admin-drivers")
      .on(
        "postgres_changes",
        {
          event:"*",
          schema:"public",
          table:"drivers",
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

    const {
      data,
      error
    } = await supabase
      .from("drivers")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false,
        }
      );


    if(!error){

      setDrivers(data || []);

    }

  }






  async function addDriver(){

    if(!name || !phone){

      alert(
        "Enter driver name and phone"
      );

      return;

    }



    const {
      error
    } = await supabase
      .from("drivers")
      .insert([
        {
          name,
          phone,
        }
      ]);



    if(error){

      alert(error.message);
      return;

    }



    setName("");
    setPhone("");

    loadDrivers();

  }






  async function deleteDriver(id){


    if(
      !window.confirm(
        "Delete driver?"
      )
    )
    return;



    const {
      error
    } = await supabase
      .from("drivers")
      .delete()
      .eq(
        "id",
        id
      );



    if(!error){

      loadDrivers();

    }


  }






  return(

    <div

      style={{
        background:"#fff",
        padding:20,
        marginTop:20,
        borderRadius:12,
      }}

    >


      <h2>
        🚜 Driver Management
      </h2>



      <div
        style={{
          marginBottom:20,
        }}
      >

        <input

          placeholder="Driver Name"

          value={name}

          onChange={(e)=>
            setName(e.target.value)
          }

          style={{
            padding:10,
          }}

        />



        <input

          placeholder="Phone"

          value={phone}

          onChange={(e)=>
            setPhone(e.target.value)
          }

          style={{
            marginLeft:10,
            padding:10,
          }}

        />



        <button

          onClick={addDriver}

          style={{
            marginLeft:10,
            padding:10,
            background:"#16a34a",
            color:"#fff",
            border:"none",
            borderRadius:6,
          }}

        >

          ➕ Add Driver

        </button>


      </div>





      <button
        onClick={loadDrivers}
        style={{
          marginBottom:15,
        }}
      >
        🔄 Refresh
      </button>





      <table

        border="1"

        cellPadding="8"

        width="100%"

        style={{
          borderCollapse:"collapse",
        }}

      >

        <thead>

          <tr>

            <th>Name</th>

            <th>Phone</th>

            <th>Action</th>

          </tr>

        </thead>



        <tbody>


        {
          drivers.map((driver)=>(


            <tr key={driver.id}>


              <td>
                {driver.name}
              </td>



              <td>

                <a
                  href={`tel:${driver.phone}`}
                >
                  {driver.phone}
                </a>

              </td>



              <td>

                <button

                  onClick={()=>
                    deleteDriver(
                      driver.id
                    )
                  }

                >

                  🗑 Delete

                </button>


              </td>


            </tr>


          ))
        }


        </tbody>


      </table>


    </div>

  );

}
