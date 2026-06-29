// services/driverService.js

export async function saveDriver(data) {
  console.log("Driver Save", data);

  return {
    success: true,
  };
}

export async function getDriver(phone) {
  console.log("Get Driver", phone);

  return null;
}

export async function updateDriver(data) {
  console.log("Update Driver", data);

  return {
    success: true,
  };
}
