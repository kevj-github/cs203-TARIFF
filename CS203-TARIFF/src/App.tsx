import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignUp";
import AppLayout from "./AppLayout";
import ProductsPage from "./components/ProductsPage";
import CalculatorPage from "./components/CalculatorPage";
import ProfilePage from "./components/ProfilePage";
// import ProductsPage from "./components/ProductsPage";
// import { ProductsPage } from "./ProductsPage";

function App() {
  return (
    <Routes>
      {/* DO NOT DELETE‼️‼️‼️ */}
      {/* <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} /> */}

      <Route element={<AppLayout />}>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/product" element={<ProductsPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
