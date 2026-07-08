// components/maps/RouteMap.jsx

import React from "react";

import MapView from "./MapView";
import FarmMarker from "./FarmMarker";
import DriverMarker from "./DriverMarker";


export default function RouteMap({

  farm = null,

  driver = null,

}) {


  return (

    <MapView>


      {
        farm && (

          <FarmMarker

            farm={farm}

          />

        )
      }



      {
        driver && (

          <DriverMarker

            driver={driver}

          />

        )
      }



    </MapView>

  );

}
