import React from "react";

export default function Layout({
  title,
  subtitle,
  children,
}) {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <h1>{title}</h1>

      {subtitle && (
        <p
          style={{
            color: "#666",
            marginBottom: 20,
          }}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
