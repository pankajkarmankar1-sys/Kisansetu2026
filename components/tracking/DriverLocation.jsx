// components/tracking/DriverLocation.jsx

import React, {
  useEffect,
  useState,
} from "react";


export default function DriverLocation({

  driver,

  onLocationChange,

}) {


  const [status, setStatus] =
    useState("Waiting for GPS...");



  useEffect(() => {


    if (!navigator.geolocation) {

      setStatus(
        "GPS not supported"
      );

      return;

    }



    const watchId =
      navigator.geolocation.watchPosition(


        (position) => {


          const location = {

            lat:
              position.coords.latitude,

            lng:
              position.coords.longitude,

          };


          setStatus(
            "GPS Active 🟢"
          );


          if(onLocationChange){

            onLocationChange(
              location
            );

          }


        },


        (error) => {


          console.error(
            error
          );


          setStatus(
            "Location permission denied"
          );


        },


        {

          enableHighAccuracy:true,

          maximumAge:5000,

          timeout:10000,

        }


      );




    return () => {

      navigator.geolocation.clearWatch(
        watchId
      );

    };


  }, [onLocationChange]);





  return (

    <div

      style={{

        background:"#fff",

        border:"1px solid #ddd",

        borderRadius:12,

        padding:15,

        marginTop:15,

      }}

    >

      <h3>
        📍 Driver Live Location
      </h3>



      <p>

        Driver:

        {" "}

        <b>

          {
            driver?.name ||
            "Unknown Driver"
          }

        </b>

      </p>



      <p>

        {
          status
        }

      </p>


    </div>

  );

}
