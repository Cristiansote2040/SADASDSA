// src/Pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.5rem", margin: "20px 0" }}>
        Ups… la página que estás buscando no existe
      </p>
      <Link
        to="/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#ff4500",
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}