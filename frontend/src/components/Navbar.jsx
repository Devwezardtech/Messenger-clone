import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => {
  const active = JSON.parse(localStorage.getItem("user") || "null");
  const stored = JSON.parse(localStorage.getItem("accounts") || "[]");

  if (active) {
    // Push logged-out user into history with timestamp
    const updated = [
      ...stored.filter((a) => a.username !== active.username), // remove duplicates
      { ...active, lastLogin: new Date().toISOString() }
    ];

    localStorage.setItem("accounts", JSON.stringify(updated));
  }

  // Clear active user but keep accounts
  localStorage.removeItem("user");
  localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="w-full p-3 border-b flex justify-between items-center bg-white">
      <h1 className="font-bold">realTime chaT</h1>
      <div>
        {token && <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>}
      </div>
    </div>
  );
}
