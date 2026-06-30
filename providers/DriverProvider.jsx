"use client";

import { DriverContext } from "../context/DriverContext";

export default function DriverProvider({ children }) {
  return (
    <DriverContext.Provider value={{}}>
      {children}
    </DriverContext.Provider>
  );
}
