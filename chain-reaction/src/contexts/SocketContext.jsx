import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const token = localStorage.getItem('token');
      console.log("Connecting to:", process.env.REACT_APP_API_URL);
      console.log("Token:", token);

      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: { token }, 
        reconnectionAttempts: 5,
        reconnectionDelay: 100,
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Connected to socket server");
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ Connection error:", err.message);
      });

      newSocket.on("disconnect", () => {
        console.log("🔌 Disconnected");
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
