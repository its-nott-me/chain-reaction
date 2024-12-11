import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create the context
const SocketContext = createContext();

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);

// Provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); // Use useState to manage the socket instance


  useEffect(() => {
    // Initialize the socket only if it hasn't been set yet
    if (!socket) {
      const newSocket = io(process.env.REACT_APP_API_URL); // Replace with your server URL
      setSocket(newSocket);

      // Listen for connection status
      newSocket.on('connect', () => {
        console.log('Connected to the socket server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from the socket server');
      });

      // Cleanup function to properly disconnect the socket
      return () => {
        newSocket.disconnect();
      };
    }
  }, []); 

  // Provide the socket instance to children
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
