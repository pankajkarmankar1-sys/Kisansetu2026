import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverProfile({ driver }) {

  const [status, setStatus] = useState(
    driver?.status || "Available"
  );

  const [loading, setLoading] = useState(false);



  async function changeStatus() {

    if (!driver?.id) {
      alert("Driver not found");
      return;
    }


    try {

      setLoading(true);


      const newStatus =
        status === "Available"
          ? "Busy"
          : "Available";


      const { error } = await supabase
        .from("drivers")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", driver.id);



      if (error) {
        throw error;
      }


      setStatus(newStatus);

      alert(
        "Status updated successfully"
      );


    } catch (err) {

      console.error(err);

      alert(
        "Status update failed"
      );


    } finally {

      setLoading(false);

    }
  }



  if (!driver) {
    return (
      <div>
        Driver data loading...
      </div>
    );
  }



  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 20,
      }}
    >

      <h2>
        👨‍🌾 Driver Profile
      </h2>


      <p>
        <b>Name :</b>
        {" "}
        {driver.name || "-"}
      </p>


      <p>
        <b>Phone :</b>
        {" "}
        {driver.phone || "-"}
      </p>


      <p>
        <b>Village :</b>
        {" "}
        {driver.village || "-"}
      </p>


      <p>
        <b>Vehicle :</b>
        {" "}
        {driver.vehicle_type || "Tractor"}
      </p>


      <p>
        <b>Experience :</b>
        {" "}
        {driver.experience || 0} Years
      </p>


      <p>
        <b>Rating :</b>
        {" "}
        ⭐ {driver.rating || "New"}
      </p>


      <p>
        <b>Status :</b>
        {" "}

        <span
          style={{
            color:
              status === "Available"
              ? "green"
              : "#d97706",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>

      </p>



      <button
        onClick={changeStatus}
        disabled={loading}
        style={{
          marginTop: 15,
          padding: "10px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {
          loading
          ? "Updating..."
          : "🔄 Change Status"
        }
      </button>


    </div>
  );
}
