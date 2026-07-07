import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AssignDriver({ booking }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    setSelectedDriver(booking?.driver_id || "");
  }, [booking]);


  async function loadDrivers() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "driver")
        .order("name");

      if (error) throw error;

      setDrivers(data || []);

    } catch (err) {
      console.error(
        "Load Drivers Error:",
        err
      );
    }
  }


  async function assignDriver() {

    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }


    const driver = drivers.find(
      (d) => d.id === selectedDriver
    );


    if (!driver) {
      alert("Driver not found");
      return;
    }


    try {

      setLoading(true);


      const { error } = await supabase
        .from("bookings")
        .update({
          driver_id: driver.id,
          driver_name: driver.name,
          driver_phone: driver.phone || "",
          status: "Accepted",
        })
        .eq(
          "id",
          booking.id
        );


      if (error) throw error;



      // Driver Notification

      await supabase
        .from("notifications")
        .insert([
          {
            user_id: driver.id,
            title: "🚜 New Booking Assigned",
            message:
              `New ${booking.service_name} booking assigned to you.`,
            created_at:
              new Date().toISOString(),
          },
        ]);



      // Customer Notification

      if (booking.customer_id) {

        await supabase
          .from("notifications")
          .insert([
            {
              user_id: booking.customer_id,
              title: "🚜 Driver Assigned",
              message:
                `${driver.name} has been assigned for your booking.`,
              created_at:
                new Date().toISOString(),
            },
          ]);

      }



      alert(
        "✅ Driver assigned successfully"
      );


    } catch (err) {

      console.error(
        "Assign Driver Error:",
        err
      );

      alert(
        err.message
      );


    } finally {

      setLoading(false);

    }
  }



  return (
    <div
      style={{
        display: "flex",
        gap: 8,
      }}
    >

      <select
        value={selectedDriver}
        onChange={(e) =>
          setSelectedDriver(
            e.target.value
          )
        }
      >

        <option value="">
          Select Driver
        </option>


        {drivers.map((driver) => (

          <option
            key={driver.id}
            value={driver.id}
          >
            {driver.name}
          </option>

        ))}

      </select>


      <button
        onClick={assignDriver}
        disabled={loading}
      >
        {
          loading
          ? "Assigning..."
          : "Assign"
        }
      </button>


    </div>
  );
}
