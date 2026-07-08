// Name Validation
export const validateName = (name) => {
  if (!name?.trim()) {
    return "Name is required";
  }

  if (name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }

  return "";
};


// Phone Validation
export const validatePhone = (phone) => {
  const p = String(phone || "").replace(/\D/g, "");

  if (p.length !== 10) {
    return "Phone number must be 10 digits";
  }

  return "";
};


// Aadhaar Validation
export const validateAadhaar = (aadhaar) => {
  const a = String(aadhaar || "").replace(/\D/g, "");

  if (a.length !== 12) {
    return "Aadhaar must be 12 digits";
  }

  return "";
};


// Required Field
export const required = (
  value,
  field = "Field"
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return `${field} is required`;
  }

  return "";
};


// File Validation
export const validateFile = (file) => {
  if (!file) {
    return "Please select a file";
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return "File size should be less than 5MB";
  }

  return "";
};
