// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// create single socket instance
const socket = io(SOCKET_URL, {
  autoConnect: false, // connect only when needed
});

export default socket;
