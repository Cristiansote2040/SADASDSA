import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function useSocket(userId) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      setConnected(true);
      if (userId) socket.emit("join-user", userId);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socket;
}