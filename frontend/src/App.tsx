import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
// import "./App";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignUp";
import AppLayout from "./AppLayout";
import ProductsPage from "./components/ProductsPage";
import ProfilePage from "./components/ProfilePage";
import "react-day-picker/style.css";

import { ProtectedRoute } from "./components/protected-route";
import TariffDashboard from "./components/TariffDashboard";
import CalculatorPage from "./components/CalculatorPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<TariffDashboard />} />
          <Route path="/product" element={<ProductsPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
