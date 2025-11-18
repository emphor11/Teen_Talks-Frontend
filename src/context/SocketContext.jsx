import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      console.log("⚠️ No token or user, not connecting socket");
      return;
    }

    console.log(`🔌 Connecting socket for user ${user.id}...`);

    const s = io("https://teen-talks-backend.onrender.com", {
      auth: { token }, // ✅ must be object
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 20000, // Increase timeout for connection
      forceNew: false, // Reuse connection if possible
      upgrade: true, // Allow transport upgrade
    });

    s.on("connect", () => {
      console.log(`✅✅✅ Socket CONNECTED for user ${user.id}:`, s.id);
      console.log(`🔗 Socket transport:`, s.io.engine.transport.name);
      console.log(`🔗 Socket connected status:`, s.connected);
    });

    // Monitor connection state
    s.on("connect_error", (err) => {
      console.error(`❌ Socket connect error for user ${user.id}:`, err.message);
      // Try to reconnect after a delay
      setTimeout(() => {
        if (!s.connected) {
          console.log("🔄 Attempting socket reconnection...");
          s.connect();
        }
      }, 2000);
    });

    // Track transport upgrades
    s.io.engine.on("upgrade", () => {
      console.log(`⬆️ Socket upgraded transport for user ${user.id}:`, s.io.engine.transport.name);
    });

    s.on("disconnect", (reason) => {
      console.log(`⚠️⚠️⚠️ Socket DISCONNECTED for user ${user.id}:`, reason);
      console.log(`🔗 Socket connected status:`, s.connected);
      
      // Always try to reconnect if disconnected
      if (!s.connected) {
        console.log(`🔄 Auto-reconnecting socket for user ${user.id}...`);
        setTimeout(() => {
          if (!s.connected) {
            s.connect();
          }
        }, 1000);
      }
    });

    s.on("reconnect", (attemptNumber) => {
      console.log(`✅ Socket reconnected for user ${user.id} after ${attemptNumber} attempts`);
    });

    s.on("reconnect_error", (error) => {
      console.error(`❌ Socket reconnection error for user ${user.id}:`, error);
    });

    setSocket(s);

    return () => {
      console.log(`🔌 Cleaning up socket for user ${user?.id}`);
      s.disconnect();
      setSocket(null);
    };
  }, [user?.id]); // Reconnect when user changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
