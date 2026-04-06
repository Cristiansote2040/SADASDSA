import { useState, useEffect } from "react";
import axios from "../services/api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/users/profile", { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { user, loading, fetchProfile, logout, setUser };
}