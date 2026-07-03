import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Component/costomer/Dashboard";

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
