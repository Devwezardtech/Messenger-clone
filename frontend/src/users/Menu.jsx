import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  Settings,
  Store,
  Mail,
  Archive,
  UserPlus,
  Bot,
  PlusCircle,
  Users,
  MessageCircle,
  Grid,
  ArrowLeft
} from "lucide-react";

export default function Menu() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  const toUser = () => navigate("/users");
  const toMenu = () => navigate("/users/menu");

  return (
    <div className="my-4 mx-8">
      {/* Header */}
      <div className="flex m-2 justify-between items-center">
        <div className="flex items-center bg-gray-100">
      <button className="mr-4 text-gray-700 hover:text-black" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>
      <h1 className="text-lg font-semibold">Menu</h1>
    </div>
        <button className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 my-2">
          <QrCode className="w-5 h-5" />
          QR Code
        </button>
      </div>

      {/* Profile section */}
      <button
        onClick={() => navigate("/switch")}
        className="w-full p-3 rounded-lg hover:bg-gray-100 transition flex items-center gap-3 shadow-sm border"
      >
        {/* Avatar */}
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.name}
          className="rounded-full w-12 h-12 border border-gray-300 shadow-sm"
        />

        {/* Name and handle */}
        <div className="flex-1 flex flex-col">
          <h4 className="font-semibold text-gray-900 text-base w-0">{user.name}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="cursor-pointer hover:underline">
              Switch profile
            </span>
            <span className="text-gray-400">
              @{user.username || user.name?.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Login history badge */}
        <div className="flex items-center justify-center bg-red-500 text-white font-medium w-6 h-6 rounded-full text-xs shadow">
          {user.loginCount || 0}
        </div>
      </button>

      {/* Settings */}
      <div className="my-8 flex items-center gap-2 cursor-pointer hover:underline">
        <Settings className="w-5 h-5 text-gray-600" />
        <button>Settings</button>
      </div>
      <div className="border mt-2 bg-black"></div>

      {/* Main options */}
      <div className="flex-col">
        <div className="my-8 flex items-center gap-2 cursor-pointer hover:underline">
          <Store className="w-5 h-5 text-gray-600" />
          <button>Marketplace</button>
        </div>
        <div className="my-8 flex items-center gap-2 cursor-pointer hover:underline">
          <Mail className="w-5 h-5 text-gray-600" />
          <button>Message requests</button>
        </div>
        <div className="my-8 flex items-center gap-2 cursor-pointer hover:underline">
          <Archive className="w-5 h-5 text-gray-600" />
          <button>Archive</button>
        </div>
      </div>

      {/* More */}
      <label className="text-xs">More</label>
      <div className="flex-col">
        <div className="my-8 flex items-center gap-2 cursor-pointer hover:underline">
          <UserPlus className="w-5 h-5 text-gray-600" />
          <button>Friend request</button>
        </div>
        <div className="my-8 flex items-center gap-2 cursor-pointer hover:underline">
          <Bot className="w-5 h-5 text-gray-600" />
          <button>AI Studio chats</button>
        </div>
        <div className="my-8 flex items-center gap-2 cursor-pointer hover:underline">
          <PlusCircle className="w-5 h-5 text-gray-600" />
          <button>Create an AI</button>
        </div>
      </div>

      {/* Communities */}
      <label className="text-xs">Communities</label>
      <div className="my-8 flex items-center gap-2 cursor-pointer hover:underline">
        <Users className="w-5 h-5 text-gray-600" />
        <button>Create community</button>
      </div>

      {/* Facebook Groups */}
      <div className="flex pb-24">
        <label className="text-xs">Facebook groups</label>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t shadow-md p-3 flex justify-around">
        <button
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600"
          onClick={toUser}
        >
          <MessageCircle className="w-5 h-5" />
          Chats
        </button>
        <button
          className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-full shadow hover:bg-gray-600"
          onClick={toMenu}
        >
          <Grid className="w-5 h-5" />
          Menu
        </button>
      </div>
    </div>
  );
}
