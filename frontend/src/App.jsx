import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./users/login";
import Register from "./users/signup";
import Users from "./users/user";
import Chat from "./users/Chat";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setToken(localStorage.getItem("token"))} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users" element={token ? <Users /> : <Navigate to="/login" />} />
      <Route path="/chat/:id" element={token ? <Chat /> : <Navigate to="/login" />} />
      <Route path="/" element={token ? <Navigate to="/users" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
