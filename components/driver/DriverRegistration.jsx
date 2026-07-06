import { useState } from "react";
import FormField from "./FormField";
import Upload from "./Upload";

export default function DriverRegistration() {
  const [driver, setDriver] = useState({
    fullName: "",
    mobile: "",
    aadhaar: "",
    vehicleType: "",
    vehicleNumber: "",
  });

  const [docs, setDocs] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    drivingLicense: null,
    rcBook: null,
    vehiclePhoto: null,
  });

  const handleChange = (field, value) => {
    setDriver({
      ...driver,
      [field]: value,
    });
  };

  const upload = (field, file) => {
    setDocs({
      ...docs,
      [field]: file,
    });
  };

  const handleSubmit = () => {
    alert("Driver Registration Saved Successfully");
    console.log(driver);
    console.log(docs);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Driver Registration</h2>

      <FormField
        label="Full Name"
        value={driver.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
      />

      <FormField
        label="Mobile Number"
        value={driver.mobile}
        onChange={(e) => handleChange("mobile", e.target.value)}
      />

      <FormField
        label="Aadhaar Number"
        value={driver.aadhaar}
        onChange={(e) => handleChange("aadhaar", e.target.value)}
      />

      <FormField
        label="Vehicle Type"
        value={driver.vehicleType}
        onChange={(e) => handleChange("vehicleType", e.target.value)}
      />

      <FormField
        label="Vehicle Number"
        value={driver.vehicleNumber}
        onChange={(e) => handleChange("vehicleNumber", e.target.value)}
      />

      <Upload
        label="Aadhaar Front"
        onUpload={(file) => upload("aadhaarFront", file)}
      />

      <Upload
        label="Aadhaar Back"
        onUpload={(file) => upload("aadhaarBack", file)}
      />

      <Upload
        label="Driving License"
        onUpload={(file) => upload("drivingLicense", file)}
      />

      <Upload
        label="RC Book"
        onUpload={(file) => upload("rcBook", file)}
      />

      <Upload
        label="Vehicle Photo"
        onUpload={(file) => upload("vehiclePhoto", file)}
      />

      <button onClick={handleSubmit}>
        Register Driver
      </button>
    </div>
  );
}
