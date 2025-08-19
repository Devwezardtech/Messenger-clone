import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        name,
        password,
      });

      const user = {
        ...res.data.user,
        lastLogin: new Date().toISOString(), // add login timestamp
      };

      // Save current session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update accounts history
      const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
      const existsIndex = accounts.findIndex(
        (acc) =>
          (acc._id && user._id && acc._id === user._id) ||
          (acc.username && user.username && acc.username === user.username)
      );

      if (existsIndex !== -1) {
        // Update existing account with latest login info
        accounts[existsIndex] = { ...accounts[existsIndex], ...user };
      } else {
        // Add new account to the list
        accounts.push(user);
      }

      localStorage.setItem("accounts", JSON.stringify(accounts));

      if (onLogin) onLogin();
      navigate("/users");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="p-6 border rounded max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full mb-2 border px-3 py-2 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 border px-3 py-2 rounded"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
        <p className="mt-3">
          No account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
