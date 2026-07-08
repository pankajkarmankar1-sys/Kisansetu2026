// engines/fleetEngine.js

import defaultDB from "../data/defaultDB";
import { TRACTOR_STATUS } from "../data/tractorStatus";



export function registerTractor(driver) {

  if (!driver?.phone) {
    return null;
  }


  const id = driver.phone;


  if (defaultDB.fleet[id]) {
    return defaultDB.fleet[id];
  }


  defaultDB.fleet[id] = {

    id,

    driverName: driver.name || "Driver",

    tractorNumber:
      driver.tractorNumber ||
      driver.tractorNum ||
      "",

    village:
      driver.village ||
      "",

    status:
      TRACTOR_STATUS.AVAILABLE,

    acresCompleted: 0,

    pendingAcres: 0,

    assignedJobs: [],

    createdAt:
      new Date().toISOString(),

  };


  return defaultDB.fleet[id];

}





export function getFleet() {

  return Object.values(
    defaultDB.fleet || {}
  );

}





export function getAvailableFleet() {

  return getFleet().filter(
    (item) =>
      item.status ===
      TRACTOR_STATUS.AVAILABLE
  );

}





export function updateFleetStatus(
  id,
  status
) {

  if (!defaultDB.fleet[id]) {
    return null;
  }


  defaultDB.fleet[id].status = status;


  return defaultDB.fleet[id];

}
