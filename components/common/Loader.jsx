import React from "react";

export default function Loader() {
  return (
    <div
      className="flex justify-center items-center py-10"
    >
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"
      ></div>
    </div>
  );
}
