import React from "react";

export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-lg p-5 transition duration-200 hover:shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
