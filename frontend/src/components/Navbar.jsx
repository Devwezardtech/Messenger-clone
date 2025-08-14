import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="w-full p-3 border-b flex justify-between items-center bg-white">
      <h1 className="font-bold">Mini Chat</h1>
      <div>
        {token && <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>}
      </div>
    </div>
  );
}
