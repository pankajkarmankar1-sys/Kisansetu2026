import React from "react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-md">

        <h2 className="text-xl font-bold mb-4">
          {title}
        </h2>

        {children}

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
