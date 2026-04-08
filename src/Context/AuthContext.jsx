// src/Context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser, registerUser } from "../services/AuthServices";
import { getProfile } from "../services/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // usuario actual
  const [loading, setLoading] = useState(true); // loading global de auth
  const [message, setMessage] = useState(null); // mensajes de login, registro, logout

  // 🔹 Cargar usuario al iniciar la app
 useEffect(() => {
  const loadUser = async (retries = 3) => {
    try {
      const res = await getProfile();
      setUser(res.data?._id ? res.data : null);
    } catch (err) {
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 3000));
        return loadUser(retries - 1);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);
  // 🔹 Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setMessage({ type: "waiting", text: "Ingresando..." });

      const res = await loginUser({ email, password });

      setUser(res); // usuario real del backend
      setMessage({ type: "success", text: "Login exitoso" });

      return { success: true, user: res };
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Error en login";
      setMessage({ type: "error", text: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Registro
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setMessage({ type: "waiting", text: "Creando cuenta..." });

      const res = await registerUser({ name, email, password });

      setMessage({ type: "success", text: res.msg });
      return { success: true, response: res };
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Error en registro";
      setMessage({ type: "error", text: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser(); // llama al backend para borrar cookie
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setMessage({ type: "success", text: "Sesión cerrada" });
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        message,
        login,
        register,
        logout,
        setMessage, // por si alguna página quiere limpiar o setear mensaje
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};