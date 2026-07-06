import React, { useRef } from "react";

export default function Upload({
  label,
  icon = "📄",
  accept = "image/*,.pdf",
  file,
  onChange,
  error,
}) {
  const inputRef = useRef(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFile = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onChange(selected);
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: 600,
          color: "#14532d",
        }}
      >
        {icon} {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        style={{ display: "none" }}
      />

      <button
        type="button"
        onClick={openPicker}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border: "2px dashed #2d8a4e",
          background: "#f7fff8",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {file ? "✅ " + file.name : "📂 Select File"}
      </button>

      {file && (
        <div
          style={{
            marginTop: 8,
            color: "#166534",
            fontSize: 13,
          }}
        >
          Selected: {file.name}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 5,
            color: "red",
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
