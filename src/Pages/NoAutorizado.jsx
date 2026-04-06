// src/pages/NoAutorizado.jsx
import { Link } from "react-router-dom";

export default function NoAutorizado() {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>No autorizado 🚫</h1>
      <p>No tenés permisos para acceder a esta sección.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}