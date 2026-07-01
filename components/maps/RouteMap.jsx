import React from "react";

import MapView from "./MapView";
import FarmMarker from "./FarmMarker";
import DriverMarker from "./DriverMarker";

export default function RouteMap({

  farm,

  driver,

}) {

  return (

    <MapView>

      <FarmMarker

        farm={farm}

      />

      <DriverMarker

        driver={driver}

      />

    </MapView>

  );

}
