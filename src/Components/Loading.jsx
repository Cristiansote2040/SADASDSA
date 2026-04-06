// src/Components/Loading.jsx
import "../Styles/Components/Loading.css";

export default function Loading({ text = "Cargando..." }) {
  return (
    <div
      className="loader-overlay"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="loader-spinner"></div>
      <p className="loader-text">{text}</p>
    </div>
  );
}