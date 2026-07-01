import React, { useState } from "react";
import DriverLocation from "./DriverLocation";
import CustomerMap from "./CustomerMap";
import ETABox from "./ETABox";
import TrackingControls from "./TrackingControls";

export default function LiveTracking({
  booking,
  driver,
  customer,
}) {

  const [driverLocation, setDriverLocation] = useState({
    lat: 0,
    lng: 0,
  });

  return (
    <div style={{ padding: 20 }}>

      <h2>📍 Live Tractor Tracking</h2>

      <ETABox
        booking={booking}
        driverLocation={driverLocation}
      />

      <CustomerMap
        booking={booking}
        driverLocation={driverLocation}
      />

      <DriverLocation
        driver={driver}
        onLocationChange={setDriverLocation}
      />

      <TrackingControls
        booking={booking}
      />

    </div>
  );
}
