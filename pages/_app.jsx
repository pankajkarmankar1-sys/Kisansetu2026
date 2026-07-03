import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";

function Book() {
  return <h2>🚜 Book Tractor Page</h2>;
}

function Bookings() {
  return <h2>📋 My Bookings Page</h2>;
}

function Profile() {
  return <h2>👤 Profile Page</h2>;
}

function Login() {
  return <h2>🔐 Login Page</h2>;
}

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
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

      <Route path="/book" element={<Book />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
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
