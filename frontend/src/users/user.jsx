import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const User = () => {
  const [allusers, setAllUsers] = useState([]); // will hold API data
  const [recentUsers, setRecentUsers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

 // Fetch all users (for search)
useEffect(() => {
  axios.get("http://localhost:5000/api/user", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setAllUsers(res.data));
}, [token]);

// Fetch recent chats
useEffect(() => {
  axios.get("http://localhost:5000/api/user/recent", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setRecentUsers(res.data));
}, [token]);

  const goToUser = (user) => navigate(`/user/${user._id}`);

  return (
    <div className="p-1 w-full max-w-md mx-8">
      <Navbar />
      {/* HEADER */}
      <div className="sticky top-0 bg-white z-10 flex justify-between items-center py-2 border-b">
        <h3 className="text-lg">Messenger</h3>
        <div>
          <button className="mx-5">***</button>
          <button className="mx-4">***</button>
        </div>
      </div>

      {/* BOTTOM MENU */}
      <div className="fixed bottom-0 left-0 w-full bg-white z-10 flex justify-between items-center p-6 border-t">
        <button className="px-16">Chat</button>
        <button className="px-16">Menu</button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          className="border border-gray-400 rounded-md p-2 w-full"
          type="search"
          placeholder="Search"
        />
      </div>

      {/* HORIZONTAL SCROLL LIST */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-flex space-x-6 px-2">
          {allusers.map((user) => (
  <button key={user._id} onClick={() => goToUser(user)}
              className="flex-shrink-0 min-w-[88px] flex flex-col items-center cursor-pointer bg-transparent border-0"
            >
              <img
                className="rounded-full w-16 h-16 object-cover border"
                src={user.avatar || "/default-avatar.png"}
                alt={user.name}
              />
              <p className="text-sm font-semibold mt-2">{user.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* VERTICAL LIST */}
      <div className="mt-6 space-y-2">
        {recentUsers.map((user) => (
  <div key={user._id} onClick={() => goToUser(user)}
            className="flex items-center gap-3 p-2 cursor-pointer"
          >
            <img
              className="w-12 h-12 rounded-full border object-cover"
              src={user.avatar || "/default-avatar.png"}
              alt={user.name}
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              {/* Replace with last message if you store it in backend */}
              <p className="text-gray-600">You: {user.lastMessage || "..."}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
