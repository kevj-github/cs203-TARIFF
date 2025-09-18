import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./components/page";

function App() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoginPage />
      </div>
    </>
  );
}

export default App;
