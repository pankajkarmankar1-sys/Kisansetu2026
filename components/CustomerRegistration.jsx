import React, { useState } from "react";
import FormField from "./FormField";
import Upload from "./Upload";

export default function CustomerRegistration() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    village: "",
    aadhaar: "",
  });

  const [documents, setDocuments] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    satbara: null,
    document8A: null,
    bankPassbook: null,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpload = (field, file) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  return (
    <div>
      <h2>Customer Registration</h2>
    </div>
  );
}
