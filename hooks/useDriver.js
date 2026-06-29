import { useState } from "react";

export default function useDriver() {
  const [drivers, setDrivers] = useState([]);

  function addDriver(driver) {
    setDrivers((prev) => [...prev, driver]);
  }

  return {
    drivers,
    addDriver,
  };
}
