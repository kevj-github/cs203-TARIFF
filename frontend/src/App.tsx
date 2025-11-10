import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import { CsvBulkUpload } from "@/components/CSVBulkUpload/CsvBulkUpload";
import LoginPage from "./components/Authorization/LoginPage";
import SignupPage from "./components/Authorization/SignUp";
import TariffRuleForm from "./components/admin/TariffRuleForm";
import AppLayout from "./AppLayout";
import ProductsPage from "./components/Product/ProductsPage";
import ProfilePage from "./components/Profile/ProfilePage";
import "react-day-picker/style.css";

import { ProtectedRoute } from "./components/protected-route";
import { AdminRoute } from "./components/admin-route";
import CalculatorPage from "./components/Calculator/CalculatorPage";
import HistoryPage from "./components/History/HistoryPage";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/product" element={<ProductsPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/calculations" element={<HistoryPage />} />
          <Route path="/bulk-upload" element={<CsvBulkUpload />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/rules" element={<TariffRuleForm />} />
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
