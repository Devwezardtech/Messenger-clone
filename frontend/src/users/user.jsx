import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { MessageSquare, Menu, Search, CircleUserRound } from "lucide-react";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // NEW
  const token = localStorage.getItem("token");
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // Connect to socket and get online users list
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      socketRef.current.emit("register", me.id);
    });

    socketRef.current.on("onlineUsers", (onlineList) => {
      setOnlineUsers(onlineList);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [me.id]);

  // Fetch users & last messages
  useEffect(() => {
    const fetchUsersAndLast = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter((u) => u._id !== me.id);
        setUsers(filtered);

        await Promise.all(
          filtered.map(async (u) => {
            try {
              const msgRes = await axios.get(
                `http://localhost:5000/api/message/conversation/${u._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              const msgs = msgRes.data || [];
              const last = msgs.length > 0 ? msgs[msgs.length - 1] : null;

              setLastMessages((prev) => ({
                ...prev,
                [u._id]: last,
              }));
            } catch (err) {
              console.error("Error fetching messages for", u._id, err);
              setLastMessages((prev) => ({ ...prev, [u._id]: null }));
            }
          })
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsersAndLast();
  }, [token, me]);

  const isUnread = (uId) => {
    const last = lastMessages[uId];
    if (!last) return false;
    return last.senderId !== me.id && last.seen === false;
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "";
    const diff = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleOpenChat = async (uId, last) => {
    if (last && last.senderId !== me.id && !last.seen) {
      setLastMessages((prev) => ({
        ...prev,
        [uId]: { ...last, seen: true },
      }));
    }

    try {
      await axios.put(
        `http://localhost:5000/api/message/mark-seen/${uId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error marking messages seen:", err);
    }

    navigate(`/chat/${uId}`);
  };

  const toUser = () => {
    navigate("/users");
  };

  const toMenu = () => {
    navigate("/users/menu");
  };

  // Filtered users for search
  const filteredUsers = searchQuery
    ? users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Search bar */}
      <div className="relative">
        {/* Search bar */}
<div className="w-full max-w-md mx-auto mt-6">
  <div className="relative">
    {/* Icon inside input */}
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    
    <input
      type="search"
      placeholder="Search users..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
    />
  </div>
</div>


        {/* Search results dropdown */}
        {searchQuery && (
          <div className="absolute top-16 left-4 right-4 bg-white shadow-md border rounded-md z-50 max-h-64 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleOpenChat(u._id, lastMessages[u._id])}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={u.avatar || "/default-avatar.png"}
                    alt={u.name}
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <div className="font-medium">{u.name}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500 text-sm">No users found</div>
            )}
          </div>
        )}
      </div>

            {/* Display online users */}
      {Object.keys(onlineUsers).length > 0 && (
        <div className="px-4 mb-4">
          <h3 className="text-md font-semibold mb-2 text-start">Online</h3>
          <div className="flex gap-4 overflow-x-auto justify-start">
            {users
              .filter((u) => onlineUsers[u._id]) // only online
              .map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleOpenChat(u._id, lastMessages[u._id])}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={u.avatar || "/default-avatar.png"}
                      alt={u.name}
                      className="w-14 h-14 rounded-full border"
                    />
                    {/* Green dot indicator */}
                    <span className="absolute bottom-1 right-1 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="text-xs mt-1 font-medium">{u.name}</div>
                </div>
              ))}
          </div>
        </div>
      )}


      {/* People list */}
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">People</h2>

        <div className="grid grid-cols-1 gap-3">
          {users.map((u) => {
            const last = lastMessages[u._id];
            const unread = isUnread(u._id);
            const preview = last
              ? last.text.length > 50
                ? last.text.slice(0, 47) + "..."
                : last.text
              : "Say hi!";

            return (
              <div
                key={u._id}
                onClick={() => handleOpenChat(u._id, last)}
                className="cursor-pointer p-3 border rounded flex items-center gap-3 hover:bg-gray-50"
              >
                <div className="relative">
                  <img
                    src={u.avatar || "/default-avatar.png"}
                    alt={u.name}
                    className="w-12 h-12 rounded-full border"
                  />
                  {onlineUsers[u._id] ? (
                    <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  ) : (
                    <span className="absolute bottom-0 right-0 text-[10px] text-gray-500">
                      {formatLastSeen(u.lastOnline)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div
                    className={`text-sm ${
                      unread ? "font-semibold text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {last ? preview : "..."}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

{/* Bottom nav */}
<div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t shadow-md p-3 flex justify-around">
  <button
    className="relative flex flex-col items-center gap-1 px-6 py-2 text-gray-700 hover:text-blue-600"
    onClick={toUser}
  >
    <MessageSquare size={22} />
    <span className="text-sm">Chat</span>

    {/* Notification badge */}
    {users.some((u) => isUnread(u._id)) && (
      <div className="absolute top-0 right-5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
        {users.filter((u) => isUnread(u._id)).length}
      </div>
    )}
  </button>

  <button
    className="flex flex-col items-center gap-1 px-6 py-2 text-gray-700 hover:text-blue-600"
    onClick={toMenu}
  >
    <Menu size={22} />
    <span className="text-sm">Menu</span>
  </button>
</div>


    </div>
  );
}
