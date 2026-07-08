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

    if (selected) {
      onChange(selected);
    }

    // Same file dobara select ho sake
    e.target.value = "";
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
          border: error
            ? "2px dashed #dc2626"
            : "2px dashed #2d8a4e",
          background: "#f7fff8",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "0.3s",
        }}
      >
        {file ? `✅ ${file.name}` : "📂 Select File"}
      </button>

      {file && (
        <div
          style={{
            marginTop: 8,
            color: "#166534",
            fontSize: 13,
            wordBreak: "break-word",
          }}
        >
          Selected: {file.name}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 5,
            color: "#dc2626",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
