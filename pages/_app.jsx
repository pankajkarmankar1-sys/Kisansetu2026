import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Customer
import Dashboard from "./Pages/Dashboard";
import BookService from "./components/customer/BookService";
import MyBookings from "./components/customer/MyBookings";
import Profile from "./components/customer/Profile";

// Auth
import OTPLogin from "./components/OTPLogin";
import Reg from "./components/Reg";

// Driver
import DriverDashboard from "./components/driver/DriverDashboard";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>

      {/* Auth */}
      <Route path="/" element={<OTPLogin />} />
      <Route path="/login" element={<OTPLogin />} />
      <Route path="/register" element={<Reg />} />

      {/* Customer */}
      <Route
        path="/dashboard"
        element={
          <Dashboard
            user={{ name: "Pankaj" }}
            onBook={() => navigate("/book")}
            onBookings={() => navigate("/bookings")}
            onProfile={() => navigate("/profile")}
            onNotifications={() => alert("Notifications")}
            onLogout={() => navigate("/login")}
          />
        }
      />

      <Route path="/book" element={<BookService />} />
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/profile" element={<Profile />} />

      {/* Driver */}
      <Route path="/driver/dashboard" element={<DriverDashboard />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
