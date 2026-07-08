import React from "react";

export default function Header({
  title,
  subtitle,
}) {
  return (
    <div
      className="text-center mb-6"
    >
      <h1
        className="text-3xl font-bold text-green-700"
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="text-gray-600 mt-2 text-base"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
