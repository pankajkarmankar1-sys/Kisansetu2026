"use client";

import { useState } from "react";
import { DriverContext } from "../context/DriverContext";


export default function DriverProvider({
  children
}) {

  const [driver, setDriver] = useState(null);


  return (

    <DriverContext.Provider
      value={{
        driver,
        setDriver,
      }}
    >

      {children}

    </DriverContext.Provider>

  );

}
