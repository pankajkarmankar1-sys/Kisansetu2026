// context/DriverContext.js

import {
  createContext,
  useContext,
  useState,
} from "react";


const DriverContext =
  createContext(null);



export function DriverProvider({
  children
}) {

  const [drivers, setDrivers] =
    useState([]);


  const [currentDriver, setCurrentDriver] =
    useState(null);


  const [loading, setLoading] =
    useState(false);



  return (

    <DriverContext.Provider

      value={{

        drivers,

        setDrivers,

        currentDriver,

        setCurrentDriver,

        loading,

        setLoading,

      }}

    >

      {children}

    </DriverContext.Provider>

  );

}





export function useDriverContext(){

  return useContext(
    DriverContext
  );

}
