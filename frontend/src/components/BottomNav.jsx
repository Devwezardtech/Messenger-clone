// src/components/BottomNav.jsx
import React from "react";
import { MessageSquare, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav({ users = [], isUnread }) {
  const navigate = useNavigate();
  const location = useLocation();

  const toUser = () => navigate("/users");
  const toMenu = () => navigate("/users/menu");

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t shadow-md p-3 flex justify-around">
      {/* Chats button */}
      <button
        className={`relative flex flex-col items-center gap-1 px-6 py-2 ${
          location.pathname === "/users"
            ? "text-blue-600"
            : "text-gray-700 hover:text-blue-600"
        }`}
        onClick={toUser}
      >
        <MessageSquare size={22} />
        <span className="text-sm">Chat</span>

        {/* Notification badge */}
{users.some((u) => isUnread && isUnread(u._id)) && (
  <div className="absolute top-0 right-5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
    {users.filter((u) => isUnread(u._id)).length}
  </div>
)}

      </button>

      {/* Menu button */}
      <button
        className={`flex flex-col items-center gap-1 px-6 py-2 ${
          location.pathname.includes("/menu")
            ? "text-blue-600"
            : "text-gray-700 hover:text-blue-600"
        }`}
        onClick={toMenu}
      >
        <Menu size={22} />
        <span className="text-sm">Menu</span>
      </button>
    </div>
  );
}
