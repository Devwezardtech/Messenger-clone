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
  ArrowLeft,
  Bell
} from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function Menu() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(""); // for popup message
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

 // function to show popup
const handleNotAvailable = (feature) => {
  setToast(
    <div>
      <strong>{feature}</strong>
      Not available yet
    </div>
  );

  setTimeout(() => setToast(""), 2000);
};


const goTOSettings = () => {
  navigate("/setting");
}



  if (!user) {
    return <div className="p-4">Loading...</div>;
  }



  return (
    <div className="my-4 mx-8 relative">
     {/* Toast popup */}
{toast && (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-yellow-100 text-black px-4 py-2 rounded-lg shadow-lg z-50">
    <Bell className="text-yellow-800" size={20} />
    <span className="whitespace-pre-line">{toast}</span>
  </div>
)}

      {/* Header */}
      <div className="flex my-2 justify-between items-center">
        <div className="flex items-center bg-gray-100">
          <button
            className="text-gray-700 hover:text-black"
            onClick={()=>{navigate(-1)}}
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg lg:text-xl font-semibold px-4">Menu</h1>
        </div>
        <button>
          <QrCode className="w-5 h-5 my-2 lg:w-7 lg:h-7 lg:my-4" />
        </button>
      </div>

      {/* Profile section */}
      <button
        onClick={() => navigate("/switch")}
        className="w-full py-3 rounded-lg hover:bg-gray-100 transition flex items-center gap-3"
      >
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.name}
          className="rounded-full w-12 h-12 border border-gray-300 shadow-sm lg:w-14 lg:h-14"
        />
        <div className="flex-1 flex flex-col">
          <h4 className="font-semibold text-gray-900 text-start w-full">
            {user.name?.length > 14 ? user.name.slice(0, 14) + "..." : user.name}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-600 lg:text-md">
            <span className="cursor-pointer lg:text-md">
              Switch profile
            </span>
            <span className="text-gray-400">
              @{user.name?.length > 14 ? user.name.slice(0, 14) + "..." : user.name || user.name?.toLowerCase().length > 14 ? user.name.slice(0, 14) + "..." : user.name}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center bg-blue-400 text-white font-medium w-6 h-6 rounded-full text-xs shadow lg:w-8 lg:h-8">
          {user.loginCount || 0}
        </div>
      </button>

      {/* Settings */}
      <div
        className="my-8 flex items-center gap-2 cursor-pointer hover:text-blue-500"
        onClick={goTOSettings}
      >
        <Settings className="w-5 h-5 text-gray-600" />
        <span className="md:text-md lg:text-lg">Settings</span>
      </div>
      <div className="border mt-2 bg-black"></div>

      {/* Main options */}
      <div className="flex-col">
        <div
          className="my-8 flex items-center gap-2 cursor-pointer hover:text-blue-500"
          onClick={() => handleNotAvailable("")}
        >
          <Store className="w-5 h-5 text-gray-600" />
          <span className="md:text-md lg:text-lg">Marketplace</span>
        </div>
        <div
          className="my-8 flex items-center gap-2 cursor-pointer hover:text-blue-500"
          onClick={() => handleNotAvailable("")}
        >
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="md:text-md lg:text-lg">Message requests</span>
        </div>
        <div
          className="my-8 flex items-center gap-2 cursor-pointer hover:text-blue-500"
          onClick={() => handleNotAvailable("")}
        >
          <Archive className="w-5 h-5 text-gray-600" />
          <span className="md:text-md lg:text-lg">Archive</span>
        </div>
      </div>

      {/* More */}
      <label className="text-xs">More</label>
      <div className="flex-col">
        <div
          className="my-8 flex items-center gap-2 cursor-pointer hover:text-blue-500"
          onClick={() => handleNotAvailable("")}
        >
          <UserPlus className="w-5 h-5 text-gray-600" />
          <span className="md:text-md lg:text-lg">Friend request</span>
        </div>
        <div
          className="my-8 flex items-center gap-2 cursor-pointer hover:text-blue-500"
          onClick={() => handleNotAvailable("")}
        >
          <Bot className="w-5 h-5 text-gray-600" />
          <span className="md:text-md lg:text-lg">AI Studio chats</span>
        </div>
        <div
          className="my-8 flex items-center gap-2 cursor-pointer hover:text-blue-500"
          onClick={() => handleNotAvailable("")}
        >
          <PlusCircle className="w-5 h-5 text-gray-600" />
          <span className="md:text-md lg:text-lg">Create an AI</span>
        </div>
      </div>

      {/* Communities */}
      <label className="text-xs">Communities</label>
      <div
        className="my-8 flex items-center gap-2 cursor-pointer hover:text-blue-500"
        onClick={() => handleNotAvailable("")}
      >
        <Users className="w-5 h-5 text-gray-600" />
        <span className="md:text-md lg:text-lg">Create community</span>
      </div>

      {/* Facebook Groups */}
      <div className="flex pb-24">
        <label className="text-xs">Facebook groups</label>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
