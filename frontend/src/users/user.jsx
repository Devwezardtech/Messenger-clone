import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const token = localStorage.getItem("token");
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

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

  const handleOpenChat = async (uId, last) => {
  // Optimistically mark as seen in UI
  if (last && last.senderId !== me.id && !last.seen) {
    setLastMessages(prev => ({
      ...prev,
      [uId]: { ...last, seen: true }
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


  return (
    <div className="min-h-screen">
      <Navbar />
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
                <img
                  src={u.avatar || "/default-avatar.png"}
                  alt={u.name}
                  className="w-12 h-12 rounded-full border"
                />
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
    </div>
  );
}
