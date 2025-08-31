import { useEffect, useState, useRef } from "react";
import api from "../components/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { MessageSquare, Menu, Search, CircleUserRound, Loader } from "lucide-react";
import BottomNav from "../components/BottomNav";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); 
  const token = localStorage.getItem("token");
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [noMessage, setNoMessage] = useState("Say hi!");
  const [loading, setLoading] = useState(true)

  // Connect to socket and get online users list
  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000" // url for mentain code
    socketRef.current = io(SOCKET_URL);

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
      setLoading(true);
      try {
        const res = await api.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter((u) => u._id !== me.id);
        setUsers(filtered);

        const msgsMap = {};
await Promise.all(
  filtered.map(async (u) => {
    try {
      const msgRes = await api.get(`/api/message/conversation/${u._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const msgs = msgRes.data || [];
      msgsMap[u._id] = msgs.length ? msgs[msgs.length - 1] : null;
    } catch (err) {
      console.error("Error fetching messages for", u._id, err);
      msgsMap[u._id] = null;
    }
  })
);
setLastMessages(msgsMap);

      } catch (err) {
        console.error(err);
        setNoMessage("Say hi!")//for no message
      }
      finally{
        setLoading(false)
      }
    };
    fetchUsersAndLast();
  }, [token, me.id]);

const isUnread = (uId) => {
  const last = lastMessages[uId] || {};
  return last.receiverId === me.id && last.senderId === uId && !last.seen;
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
    const updatedLast = { ...last, seen: true };
    setLastMessages((prev) => ({
      ...prev,
      [uId]: updatedLast,
    }));

    try {
      await api.put(
        `/api/message/mark-seen/${uId}`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error marking messages seen:", err);
    }
  }

  navigate(`/chat/${uId}`);
};


  // Filtered users for search
  const filteredUsers = searchQuery
    ? users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

    

  return (
    <div>

         <Navbar />
      
   
    <div className="min-h-screen">
     

      {/* Search bar */}
      <div className="relative justify-center item-center">
        {/* Search bar */}
<div className="w-full max-w-lg mx-auto mt-1 pt-20">
  <div className="relative mx-4">
    {/* Icon inside input */}
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    
    <input
      type="search"
      placeholder="Search users..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full  rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm"
    />
  </div>
</div>


        {/* Search results dropdown */}
   {searchQuery && (
  <div className="absolute mt-1 w-full flex justify-center">
    <div className="bg-white shadow-sm border rounded-md z-50 max-h-64 overflow-y-auto scrollbar-hide w-[93%] md:w-[485px]">
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
  </div>
)}

      </div>

           {loading ? (
            <div className="px-5 mb-2 mx-1 mt-1 lg:mt-2 max-w-2xl mx-auto ">
    <div className="bg-gray-200 h-6 w-16 mb-2 rounded-md"></div>
    <div className="flex gap-9 justify-start animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gray-200"></div>
          <div className="w-14 h-4 mt-1 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
) : (   
      Object.keys(onlineUsers).length > 0 ? (
        <div className="px-4 mb-4 mx-1 mt-1 lg:mt-2 max-w-2xl mx-auto">
          
          <div className="flex gap-4 overflow-x-auto justify-start">
            {users
              .filter((u) => onlineUsers[u._id]) // only online
              .map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleOpenChat(u._id, lastMessages[u._id])}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <h3 className="text-md font-semibold mb-2 text-start">Online</h3> 
                  <div className="relative">
                    <img
                      src={u.avatar || "/default-avatar.png"}
                      alt={u.name}
                      className="w-14 h-14 rounded-full border"
                    />
                    {/* Green dot indicator */}
                    <span className="absolute bottom-1 right-1 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="text-xs mt-1 font-medium">{u.name?.length > 8 ? u.name.slice(0, 14) + "..." : u.name}</div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div></div>
      )
    )}


      {/* People list */}
      <div className="p-4 max-w-2xl mx-auto lg:pb-20 pb-24">
        

          {loading ? (
            <div>

              <div className="bg-gray-200 w-24 h-8 rounded-md mb-4 animate-pulse"></div>
    <div className="space-y-7">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-5 animate-pulse"
        >
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2">
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
    </div>
  ) : (
    <div>
          <h2 className="text-md font-semibold mb-4 md:text-lg lg:text-xl lg:mb-12">People</h2>

        <div className="grid grid-cols-1 gap-3">
          {users.map((u) => {
            const last = lastMessages[u._id];
            const unread = isUnread(u._id);
            const preview = last
  ? last.text.length > 50
    ? last.text.slice(0, 47) + "..."
    : last.text
  : noMessage;


            return (
              <div
                key={u._id}
                onClick={() => handleOpenChat(u._id, last)}
                className="cursor-pointer py-3 px-1 rounded flex items-center gap-3 hover:bg-gray-50 lg:gap-12 lg:py-4 lg:px-2"
              >
                <div className="relative">
                  <img
                    src={u.avatar || "/default-avatar.png"}
                    alt={u.name}
                    className="w-12 h-12 rounded-full border lg:w-16 lg:h-16"
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
                  <div className="font-medium">{u.name?.length > 32 ? u.name.slice(0, 14) + "..." : u.name}</div>
                  <div
                    className={`text-sm md:text-md lg:text-lg ${
                      unread ? "font-semibold text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {last ? preview : noMessage}
                  </div>
                </div>
              </div>
              
            );
          })}
        </div>
        </div>
  )}
        </div>
      

{/* Bottom nav */}
<BottomNav users={users} isUnread={isUnread} />


    </div>
     </div>
  
  );
}
