import React from "react";

export default function FormField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  error
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontWeight: "600",
          color: "#14532d"
        }}
      >
        {icon} {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: error ? "2px solid red" : "1px solid #ccc",
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box"
        }}
      />

      {error && (
        <div
          style={{
            color: "red",
            marginTop: "5px",
            fontSize: "13px"
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
