import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import ErrorPage from "../Components/ErrorPage";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // 🔹 Usar variable de entorno correcta de React
      const SOCKET_URL =
        "https://backend-c5fo.onrender.com/" || "http://localhost:5000"; 
        // Vite usa import.meta.env
        // CRA usaría process.env.REACT_APP_BACKEND_URL

      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
      });

      newSocket.on("connect_error", (err) => {
        setError("No se pudo conectar al servidor de sockets");
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    } catch (err) {
      setError("Error inesperado al inicializar Socket");
    }
  }, []);

  if (error) return <ErrorPage msg={error} showHome={true} />;

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};