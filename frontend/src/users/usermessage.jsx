import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const UserMessage = () => {
  const { id } = useParams(); // other user's ID from route
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // Get token from localStorage (set when user logs in)
  const token = localStorage.getItem("token");

  // Fetch selected user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    if (id) fetchUser();
  }, [id, token]);

  // Fetch messages between logged-in user and selected user
  useEffect(() => {
    if (!id) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/message/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

        setMessages(res.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [id, token]);

  // Send new message
  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
  `http://localhost:5000/api/message/${id}`,
  { message },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

      setMessages((prev) => [...prev, res.data]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-md w-full mx-auto">
      <Navbar />
      {/* HEADER */}
      <div className="flex justify-between fixed top-0 w-full max-w-md border-b p-2 bg-white">
        <div className="flex items-center">
          <img
            className="border rounded-full w-12 h-12"
            src={user.avatar || "/default-avatar.png"}
            alt={user.name || "User"}
          />
          <h2 className="font-semibold mx-4">{user.name}</h2>
        </div>
        <div className="flex items-center gap-4">
          <button>Call</button>
          <button>VC</button>
          <button>Icon</button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="mt-16 mb-16 space-y-3">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === user?.idFromToken; // this will be handled on backend if needed
          return (
            <div
              key={msg._id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {!isCurrentUser && (
                <img
                  className="border rounded-full w-8 h-8 mr-2"
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.name || "User"}
                />
              )}
              <div
                className={`px-3 py-2 rounded-lg max-w-xs ${
                  isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="fixed bottom-0 left-0 w-full max-w-md flex items-center border-t p-2 bg-white">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default UserMessage;
