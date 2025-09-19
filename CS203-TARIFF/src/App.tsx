import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/page";
import SignupPage from "./components/SignUp";

function App() {
  // return (
  //   <>
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <LoginPage />
  //     </div>
  //   </>
  // );

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
