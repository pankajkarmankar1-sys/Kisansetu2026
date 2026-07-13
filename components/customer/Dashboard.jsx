import React from "react";
import "../../styles/dashboard.css";

export default function Dashboard({
  user,
  farms = [],
  onBook,
  onBookings,
  onProfile,
  onNotifications,
  onSubscription,
  onLogout,
  onAddFarm,
  onAdmin,
  onDriver,
}) {
  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <div
        className="rounded-3xl p-6 shadow-2xl text-white"
        style={{
          background:
            "linear-gradient(135deg,#1B5E20,#2E7D32,#43A047)",
        }}
      >
        <div className="flex justify-between items-center">

          <div>

            <p className="text-green-100 text-sm">
              Welcome Back
            </p>

            <h1 className="text-3xl font-extrabold mt-2">
              🌾 KisanSetu
            </h1>

            <h2 className="text-xl font-bold mt-5">
              Namaste {user?.name || "Farmer"} 👋
            </h2>

            <p className="text-green-100 mt-2">
              Farmer Account
            </p>

          </div>

          <div className="text-center">

            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center text-5xl shadow-lg">
              👨‍🌾
            </div>

            <div className="bg-yellow-400 text-green-900 font-bold rounded-full px-3 py-1 mt-3 text-sm">
              PREMIUM
            </div>

          </div>

        </div>
      </div>

      {/* ================= MY FARMS ================= */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold text-green-700">
              🌾 My Farms
            </h2>

            <p className="text-gray-500 mt-2">
              Total Registered Farms
            </p>

            <h1 className="text-5xl font-extrabold text-green-700 mt-2">
              {farms.length}
            </h1>

          </div>

          <button
            onClick={onAddFarm}
            className="bg-green-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
          >
            ➕ Add Farm
          </button>

        </div>

      </div>

      {/* ================= PREMIUM ================= */}

      <div
        className="rounded-3xl p-6 mt-6 shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg,#F9A825,#FBC02D,#FFD54F)",
        }}
      >
        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-3xl font-bold text-white">
              💎 KisanSetu Premium
            </h2>

            <p className="text-white text-lg mt-3">
              ₹550 / Acre / Year
            </p>

            <div className="text-white mt-4 leading-8">
              ✅ Priority Booking<br />
              ✅ Premium Support<br />
              ✅ Crop Guidance<br />
              ✅ Exclusive Offers
            </div>

            <button
              onClick={onSubscription}
              className="mt-5 bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold shadow-lg"
            >
              Activate Premium
            </button>

          </div>

          <div className="text-7xl">
            👑
          </div>

        </div>
      </div>

      {/* PART 2 STARTS FROM SERVICES */}
      {/* ================= FARM SERVICES ================= */}

      <h2 className="text-2xl font-bold mt-8 mb-4 text-green-700">
        🚜 Farm Services
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <Card
          icon="🚜"
          title="Tractor"
          text="Book Tractor"
          click={onBook}
        />

        <Card
          icon="🌱"
          title="Rotavator"
          text="Land Preparation"
          click={onBook}
        />

        <Card
          icon="🌾"
          title="Cultivator"
          text="Soil Work"
          click={onBook}
        />

        <Card
          icon="💧"
          title="Sprayer"
          text="Crop Spraying"
          click={onBook}
        />

        <Card
          icon="🌿"
          title="Seeder"
          text="Seed Sowing"
          click={onBook}
        />

        <Card
          icon="🚛"
          title="Transport"
          text="Farm Transport"
          click={onBook}
        />

        <Card
          icon="🚜"
          title="Harvester"
          text="Harvest Service"
          click={onBook}
        />

        <Card
          icon="📋"
          title="My Bookings"
          text="Booking History"
          click={onBookings}
        />

      </div>

      {/* ================= UPCOMING BOOKING ================= */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">

        <h2 className="text-xl font-bold text-green-700">
          📅 Upcoming Booking
        </h2>

        <p className="text-gray-500 mt-3">
          No upcoming booking available.
        </p>

      </div>

{/* ================= SUBSCRIPTION STATUS ================= */}

<div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

  <h2 className="text-xl font-bold text-green-700">
    🌱 Subscription Status
  </h2>

  <h3 style={{ marginTop: 10 }}>
    {user?.subscription_status === "active"
      ? "✅ Active"
      : "❌ Not Active"}
  </h3>

  <button
    onClick={onSubscription}
    className="primaryBtn"
    style={{ marginTop: 15 }}
  >
    Activate / View
  </button>

</div>

{/* ================= NEARBY DRIVERS ================= */}

<div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

  <h2 className="text-xl font-bold text-green-700">
    🚜 Nearby Drivers
  </h2>

  <p style={{ marginTop: 10 }}>
    No Driver Available
  </p>

</div>

{/* ================= HELP & SUPPORT ================= */}

<div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

  <h2 className="text-xl font-bold text-green-700">
    ☎ Help & Support
  </h2>

  <p style={{ marginTop: 10 }}>
    Need help? Contact KisanSetu Support.
  </p>

</div>


      {/* ================= ADMIN ================= */}

      {user?.role === "admin" && (
        <div className="mt-6">
          <button
            onClick={onAdmin}
            className="w-full bg-purple-600 text-white rounded-3xl p-5 font-bold shadow-xl"
          >
            👑 Admin Dashboard
          </button>
        </div>
      )}
      

      {/* ================= DRIVER ================= */}

      {user?.role === "driver" && (
        <div className="mt-6">
          <button
            onClick={onDriver}
            className="w-full bg-blue-600 text-white rounded-3xl p-5 font-bold shadow-xl"
          >
            🚜 Driver Panel
          </button>
        </div>
      )}

      {/* ================= PROFILE MENU ================= */}

      <div className="mt-8 space-y-4">
{/* ================= QUICK ACTIONS ================= */}

<div className="grid grid-cols-2 gap-4 mt-8">

  <button
    onClick={onProfile}
    className="bg-white rounded-3xl p-5 shadow-xl"
  >
    <div className="text-4xl">👤</div>
    <h3 className="mt-3 font-bold">Profile</h3>
    <p className="text-sm text-gray-500">
      My Account
    </p>
  </button>

  <button
    onClick={onNotifications}
    className="bg-white rounded-3xl p-5 shadow-xl"
  >
    <div className="text-4xl">🔔</div>
    <h3 className="mt-3 font-bold">
      Notifications
    </h3>
    <p className="text-sm text-gray-500">
      View Alerts
    </p>
  </button>

</div>

      {/* ================= LOGOUT ================= */}

      <button
        onClick={onLogout}
        className="w-full bg-red-600 text-white rounded-3xl p-5 mt-6 font-bold shadow-xl"
      >
        🚪 Logout
      </button>

</div>
      {/* ================= BOTTOM NAVIGATION ================= */}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl">

        <div className="grid grid-cols-5 text-center py-3">

          <button className="text-green-700 font-bold">
            <div className="text-2xl">🏠</div>
            <div className="text-xs">Home</div>
          </button>

          <button onClick={onAddFarm}>
            <div className="text-2xl">🌾</div>
            <div className="text-xs">Farms</div>
          </button>

          <button onClick={onBook}>
            <div className="text-2xl">🚜</div>
            <div className="text-xs">Book</div>
          </button>

          <button onClick={onBookings}>
            <div className="text-2xl">📋</div>
            <div className="text-xs">Bookings</div>
          </button>

          <button onClick={onProfile}>
            <div className="text-2xl">👤</div>
            <div className="text-xs">Profile</div>
          </button>

        </div>

      </div>

    </div>
  );
}

function Card({ icon, title, text, click }) {
  return (
    <button
      onClick={click}
      className="bg-white rounded-3xl p-5 shadow-xl text-left hover:scale-105 transition-all"
    >
      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="text-lg font-bold mt-3 text-green-700">
        {title}
      </h3>

      <p className="text-gray-500 mt-2">
        {text}
      </p>
    </button>
  );
}
