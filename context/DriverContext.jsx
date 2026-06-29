import { createContext, useContext, useState } from "react";

const DriverContext = createContext();

export function DriverProvider({ children }) {
  const [drivers, setDrivers] = useState([]);

  return (
    <DriverContext.Provider
      value={{
        drivers,
        setDrivers,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDriverContext() {
  return useContext(DriverContext);
}
