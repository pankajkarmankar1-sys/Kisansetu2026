import defaultDB from "../data/defaultDB";
import { TRACTOR_STATUS } from "../data/tractorStatus";

export function registerTractor(driver) {
  const id = driver.phone;

  if (defaultDB.fleet[id]) return;

  defaultDB.fleet[id] = {
    id,
    driverName: driver.name,
    tractorNumber: driver.tractorNumber || "",
    village: driver.village || "",
    status: TRACTOR_STATUS.AVAILABLE,
    acresCompleted: 0,
    pendingAcres: 0,
    assignedJobs: [],
  };
}

export function getFleet() {
  return Object.values(defaultDB.fleet);
}

export function getAvailableFleet() {
  return Object.values(defaultDB.fleet).filter(
    (item) => item.status === TRACTOR_STATUS.AVAILABLE
  );
}

export function updateFleetStatus(id, status) {
  if (!defaultDB.fleet[id]) return;

  defaultDB.fleet[id].status = status;
}
