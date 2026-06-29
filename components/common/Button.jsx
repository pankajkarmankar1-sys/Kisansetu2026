import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg transition duration-200 disabled:bg-gray-400 ${className}`}
    >
      {children}
    </button>
  );
}
