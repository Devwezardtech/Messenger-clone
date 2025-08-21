import React, { useState } from "react";
import api from "../components/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", { name, password });
      alert("Registered. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="p-6 border rounded max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full mb-2 border px-3 py-2 rounded" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full mb-4 border px-3 py-2 rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
        <p className="mt-3">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}
