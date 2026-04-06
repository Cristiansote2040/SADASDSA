export default function ErrorPage({ code = 500, message = "Ocurrió un error inesperado" }) {
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
      <h1 style={{ fontSize: "6rem", margin: 0 }}>{code}</h1>
      <p style={{ fontSize: "1.5rem", margin: "20px 0" }}>{message}</p>

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ff4500",
          color: "#fff",
          borderRadius: "5px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Volver al inicio
      </button>
    </div>
  );
}