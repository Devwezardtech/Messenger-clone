import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, LogOut } from "lucide-react"; // lucide icons

export default function Navbar() {
  const [lg, setLg] = useState(false)

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

 const logout = () => {
  setLg(true);
 }

 const confirmLogout = () => {
   try {
    const active = JSON.parse(localStorage.getItem("user") || "null");
   const stored = JSON.parse(localStorage.getItem("accounts") || "[]");
    if (active) {
      // Push logged-out user into history with timestamp
      const updated = [
        ...stored.filter((a) => a.username !== active.username), // remove duplicates
        { ...active, lastLogin: new Date().toISOString() },
      ];

      localStorage.setItem("accounts", JSON.stringify(updated));
    }

    // Clear active user but keep accounts
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setTimeout(() =>{
      navigate("/login");
    }, 500)
    
   } catch (error) {
    console.error("err", error)
   }
 }

 const cancelLogout = () => {
  setLg(false);
 }

    
    
  /*    
    */
   

  return (
    <div className="w-full py-4 px-6 border-b flex justify-between items-center bg-white shadow-sm">

        {/* Logout Confirmation Modal */}
      {lg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h6 className="text-sm font-semibold mb-4">
              Are you sure you want to logout?
            </h6>
            <div className="flex justify-center item-center gap-8">
              <button
                onClick={cancelLogout}
                className="text-sm px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="text-sm px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Logo / Title */}
      <div className="flex items-center gap-2 text-indigo-600">
        <MessageCircle size={22} />
        <h1 className="font-bold text-lg">RealTime Chat</h1>
      </div>

      {/* Right Side */}
      <div>
  {token && (
    <button
      onClick={logout}
      className="group flex items-center gap-2 hover:shadow-sm text-black px-2 py-1 rounded-md transition-all duration-300"
    >
      {/* Icon always visible */}
      <LogOut size={18} />

      {/* Text appears only on hover */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">
        Logout
      </span>
    </button>
  )}
</div>

    </div>
  );
}
