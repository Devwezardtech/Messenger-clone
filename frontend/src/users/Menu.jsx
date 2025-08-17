import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const toUser = () => {
   navigate("/users");
  }

  const toMenu = () => {
   navigate("/users/menu");
  }

  return (
    <div className="m-4">
      {/* Header */}
      <div className="flex m-2 justify-between items-center">
        <h2 className="text-xl font-semibold my-2">Menu</h2>
        <button className="px-3 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 my-2">
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
    <h4 className="font-semibold text-gray-900 text-base">{user.name}</h4>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="cursor-pointer hover:underline">Switch profile</span>
      <span className="text-gray-400">@{user.username || user.name?.toLowerCase()}</span>
    </div>
  </div>

  {/* Login history badge */}
  <div className="flex items-center justify-center bg-red-500 text-white font-medium w-6 h-6 rounded-full text-xs shadow">
    {user.loginCount || 0}
  </div>
</button>


      <div className="flex flex-col m-2">
      </div>
      
      <div className="my-8">
         <button className="mb-8">Settings</button>
         <div className="border mt-2 bg-black"></div>
      </div>
      <div className="flex-col">
         <div className="my-8"><button>Marketplace</button></div>
         <div className="my-8"><button>Message requests</button></div>
         <div className="my-8"><button>Archive</button></div>
         
         
         
      </div>
      <label className="text-xs">More</label>
      <div className="flex-col">
         <div className="my-8"><button>Friend request</button></div>
         <div className="my-8"><button>AI Studio chats</button></div>
         <div className="my-8"> <button>Create an AI</button></div>
         
         
        
      </div>
      <label className="text-xs">Communities</label>
      <div className="my-8">
        <button>Create community</button>
      </div>
      <div className="flex pb-24">
      <label className="text-xs">Facebook groups</label>
      </div>
          <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t shadow-md p-3 flex justify-around">
  <button className="px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600" onClick={toUser}>
    Chats
  </button>
  <button className="px-4 py-2 bg-gray-500 text-white rounded-full shadow hover:bg-gray-600" onClick={toMenu}> 
    Menu
  </button>
</div>

    </div>
  );
}
