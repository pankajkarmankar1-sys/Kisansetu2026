import React from "react";

export default function Profile({ user, back }) {
  return (
    <div className="min-h-screen bg-green-50 p-4">

      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={back}
          className="bg-white rounded-xl shadow px-4 py-2 mr-3"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-green-700">
          👤 My Profile
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6">

        <div className="text-center">
          <div className="text-7xl">👨‍🌾</div>

          <h2 className="text-2xl font-bold mt-4">
            {user?.name || "Farmer"}
          </h2>

          <p className="text-gray-500 mt-2">
            {user?.phone || "No Mobile"}
          </p>
        </div>

        <div className="mt-8 space-y-4">

          <div className="bg-green-50 rounded-2xl p-4">
            <strong>Address</strong>
            <br />
            {user?.address || "-"}
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <strong>State</strong>
            <br />
            {user?.state || "-"}
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <strong>District</strong>
            <br />
            {user?.district || "-"}
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <strong>Taluka</strong>
            <br />
            {user?.taluka || "-"}
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <strong>Village</strong>
            <br />
            {user?.village || "-"}
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <strong>Subscription</strong>
            <br />
            {user?.subscription_status === "active"
              ? "✅ Active"
              : "❌ Not Active"}
          </div>

        </div>

      </div>

    </div>
  );
}
