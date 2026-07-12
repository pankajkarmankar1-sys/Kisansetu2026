import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverList() {

  const [drivers,setDrivers] = useState([]);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    loadDrivers();

    const channel = supabase
      .channel("admin-drivers")
      .on(
        "postgres_changes",
        {
          event:"*",
          schema:"public",
          table:"drivers"
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
      .from("drivers")
      .select("*")
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

      console.log(err.message);

    }
    finally{

      setLoading(false);

    }

  }

  async function updateStatus(id,status){

    try{

      const {
        error
      } = await supabase
      .from("drivers")
      .update({
        approval_status:status
      })
      .eq("id",id);

      if(error)
        throw error;

      alert("Driver Updated");

      loadDrivers();

    }
    catch(err){

      alert(err.message);

    }

  }
  async function deleteDriver(id){

    const confirmDelete =
      window.confirm(
        "Delete driver?"
      );

    if(!confirmDelete)
      return;

    const {
      error
    } = await supabase
      .from("drivers")
      .delete()
      .eq("id",id);

    if(error){

      alert(error.message);

      return;

    }

    alert("Driver Deleted");

    loadDrivers();

  }

  const filteredDrivers =
    drivers.filter((driver)=>

      JSON.stringify(driver)
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

    );

  if(loading){

    return(
      <h3>
        Loading Drivers...
      </h3>
    );

  }

  return(

    <div
      style={{
        background:"#fff",
        padding:20,
        marginTop:20,
        borderRadius:12
      }}
    >

      <h2>
        🚜 Driver Management
      </h2>

      <input
        placeholder="Search driver..."
        value={search}
        onChange={(e)=>
          setSearch(e.target.value)
        }
        style={{
          width:"100%",
          padding:10,
          margin:"15px 0",
          borderRadius:8
        }}
      />

      <button
        onClick={loadDrivers}
        style={{
          padding:10,
          background:"#16a34a",
          color:"#fff",
          border:"none",
          borderRadius:8,
          marginBottom:15
        }}
      >
        🔄 Refresh
      </button>

      <div
        style={{
          overflowX:"auto"
        }}
      >

      <table
        width="100%"
        border="1"
        cellPadding="8"
      >

        <thead>

          <tr>

            <th>Name</th>
            <th>Phone</th>
            <th>Village</th>
            <th>Tractor</th>
            <th>Status</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>
          {
          filteredDrivers.length === 0

          ?

          (

            <tr>

              <td colSpan="6">
                No Drivers Found
              </td>

            </tr>

          )

          :

          filteredDrivers.map((driver)=>(

            <tr key={driver.id}>

              <td>
                {driver.name || "-"}
              </td>

              <td>
                {driver.phone || "-"}
              </td>

              <td>
                {driver.village || "-"}
              </td>

              <td>
                {driver.tractor_num || "-"}
              </td>

              <td>

                <b>

                  {driver.approval_status || "Pending"}

                </b>

              </td>

              <td>

                {
                  driver.approval_status !== "approved" &&

                  <button

                    onClick={()=>
                      updateStatus(
                        driver.id,
                        "approved"
                      )
                    }

                    style={{
                      background:"#16a34a",
                      color:"#fff",
                      border:"none",
                      padding:"8px 12px",
                      borderRadius:6,
                      marginRight:8
                    }}

                  >

                    ✅ Approve

                  </button>

                }

                {
                  driver.approval_status !== "rejected" &&

                  <button

                    onClick={()=>
                      updateStatus(
                        driver.id,
                        "rejected"
                      )
                    }

                    style={{
                      background:"#f59e0b",
                      color:"#fff",
                      border:"none",
                      padding:"8px 12px",
                      borderRadius:6,
                      marginRight:8
                    }}

                  >

                    ❌ Reject

                  </button>

                }

                <button

                  onClick={()=>
                    deleteDriver(
                      driver.id
                    )
                  }

                  style={{
                    background:"#dc2626",
                    color:"#fff",
                    border:"none",
                    padding:"8px 12px",
                    borderRadius:6
                  }}

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

    </div>

  );

}
