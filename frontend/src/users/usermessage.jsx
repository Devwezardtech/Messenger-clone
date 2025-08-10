import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const UserMessage = () => {
  const { id } = useParams(); // other user's ID from route
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // TODO: replace with actual logged-in user's ObjectId from DB
  const currentUserId = "64f2bcd8e6c1a3b9b4d5e789"; // valid ObjectId

  // Fetch selected user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user`);
        const foundUser = res.data.find((u) => u._id === id);
        setUser(foundUser || null);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [id]);

  // Fetch messages between current user and selected user
  useEffect(() => {
    if (!id) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/usermessages/${id}`,
          { params: { currentUserId } }
        );
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [id, currentUserId]);

  // Send new message
  const sendMessage = async () => {
  if (!message.trim()) return;
  try {
    const res = await axios.post(
      `http://localhost:5000/api/usermessages/${id}`,
      {
        message,
        senderId: currentUserId,
      }
    );
    console.log("Message sent:", res.data);  // <-- add this line
    setMessages((prev) => [...prev, res.data]);
    setMessage("");
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-md w-full mx-auto">
      {/* HEADER */}
      <div className="flex justify-between fixed top-0 w-full max-w-md border-b p-2 bg-white">
        <div className="flex items-center">
          <img
            className="border rounded-full w-12 h-12"
            src={user.name}
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
          const isCurrentUser = msg.senderId === currentUserId;
          return (
            <div
              key={msg._id || msg.id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {!isCurrentUser && (
                <img
                  className="border rounded-full w-8 h-8 mr-2"
                  src={user.name}
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
