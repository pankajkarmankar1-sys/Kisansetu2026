// components/tracking/LiveTracking.jsx

import React, {
  useState,
} from "react";


import DriverLocation from "./DriverLocation";
import CustomerMap from "./CustomerMap";
import ETABox from "./ETABox";
import TrackingControls from "./TrackingControls";



export default function LiveTracking({

  booking,

  driver,

  customer,

}) {


  const [driverLocation, setDriverLocation] =
    useState(null);


  const [tracking, setTracking] =
    useState(false);




  function startTracking(){

    setTracking(true);

  }




  function pauseTracking(){

    setTracking(false);

  }




  function stopTracking(){

    setTracking(false);

    setDriverLocation(null);

  }




  function refreshLocation(){

    setTracking(true);

  }





  return (

    <div

      style={{

        padding:20,

      }}

    >


      <h2>
        📍 Live Tractor Tracking
      </h2>



      <ETABox

        booking={booking}

        driverLocation={driverLocation}

      />



      <CustomerMap

        booking={booking}

        customer={customer}

        driverLocation={driverLocation}

      />



      <DriverLocation

        driver={driver}

        active={tracking}

        onLocationChange={
          setDriverLocation
        }

      />



      <TrackingControls

        booking={booking}

        onStart={startTracking}

        onPause={pauseTracking}

        onStop={stopTracking}

        onRefresh={refreshLocation}

      />


    </div>

  );

}
