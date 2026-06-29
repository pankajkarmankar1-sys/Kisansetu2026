// services/customerService.js

export async function saveCustomer(data) {
  console.log("Customer Save", data);

  return {
    success: true,
  };
}

export async function getCustomer(phone) {
  console.log("Get Customer", phone);

  return null;
}

export async function updateCustomer(data) {
  console.log("Update Customer", data);

  return {
    success: true,
  };
}
