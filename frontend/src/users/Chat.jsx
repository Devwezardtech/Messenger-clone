import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";

export default function Chat() {
  const { id: otherUserId } = useParams();
  const token = localStorage.getItem("token");
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const [other, setOther] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null); // NEW

  const socketRef = useRef(null);
  const messagesRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const myId = me?.id;

  // Helper: Convert date to "time ago"
  function timeAgo(date) {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hrs ago`;
    return `${days} days ago`;
  }

  // Fetch other user info
  useEffect(() => {
    const fetchOther = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/${otherUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOther(res.data);
        setLastSeen(res.data.lastOnline || null); // NEW
      } catch (err) {
        console.error(err);
      }
    };
    fetchOther();
  }, [otherUserId, token]);

  // Fetch conversation + mark seen
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/conversation/${otherUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const msgs = res.data || [];
        setMessages(msgs);

        const hasUnseenFromOther = msgs.some(
          (m) => m.senderId === otherUserId && !m.seen
        );
        if (hasUnseenFromOther) {
          try {
            await axios.patch(
              `http://localhost:5000/api/message/seen/${otherUserId}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages((prev) =>
              prev.map((m) =>
                m.senderId === otherUserId
                  ? {
                      ...m,
                      seen: true,
                      seenAt: m.seenAt || new Date().toISOString(),
                    }
                  : m
              )
            );
          } catch (err) {
            console.error("Failed to mark seen:", err);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (otherUserId) fetchMessages();
  }, [otherUserId, token]);

  // Connect socket and listen for events
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("connect", () => {
      socketRef.current.emit("register", myId);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === otherUserId && msg.receiverId === myId) ||
        (msg.senderId === myId && msg.receiverId === otherUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socketRef.current.on("messageSaved", (msg) => {
      if (
        (msg.senderId === myId && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === myId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Typing listeners
    socketRef.current.on("typing", ({ senderId }) => {
      if (senderId === otherUserId) {
        setIsTyping(true);
      }
    });

    socketRef.current.on("stopTyping", ({ senderId }) => {
      if (senderId === otherUserId) {
        setIsTyping(false);
      }
    });

    // Online users listener
    socketRef.current.on("onlineUsers", (users) => {
      if (users.includes(otherUserId)) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [myId, otherUserId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    socketRef.current.emit("directMessage", {
      senderId: myId,
      receiverId: otherUserId,
      text,
    });
    setText("");
    socketRef.current.emit("stopTyping", {
      senderId: myId,
      receiverId: otherUserId,
    });
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    socketRef.current.emit("typing", {
      senderId: myId,
      receiverId: otherUserId,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", {
        senderId: myId,
        receiverId: otherUserId,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={other?.avatar || "/default-avatar.png"}
              alt={other?.name}
              className="w-12 h-12 rounded-full border"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full border border-white"></span>
            )}
          </div>
          <div>
            <div className="font-medium">{other?.name || "Loading..."}</div>
            <div className="text-sm text-gray-500">
              {isTyping
                ? "Typing..."
                : isOnline
                ? "Online"
                : lastSeen
                ? `Last seen ${timeAgo(lastSeen)}`
                : "Offline"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesRef}
          className="border rounded p-3 h-[60vh] overflow-y-auto mb-4 space-y-3"
        >
          {messages.map((m) => {
            const mine = m.senderId === myId;
            return (
              <div
                key={m._id || `${m.senderId}-${m.receiverId}-${m.createdAt}`}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                {!mine && (
                  <img
                    src={other?.avatar || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    mine
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {m.text}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-grow border px-3 py-2 rounded"
          />
          <button
            onClick={send}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
