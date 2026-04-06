// src/components/ProtectedRoute.jsx
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) setChecked(true);
  }, [loading]);

  if (!checked) return <p>Cargando...</p>; // mientras verifica

  if (!user) return <Navigate to="/no-autorizado" replace />;

  if (adminOnly && user.role !== "admin") return <Navigate to="/no-autorizado" replace />;

  return children;
}