export default function WhatsAppButton() {
  const phone = "5491123456789"; // 👈 tu número (con código país sin +)
  const message = "Hola! Tengo una consulta 👋";

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#25D366",
        color: "white",
        padding: "12px 16px",
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        textDecoration: "none",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: 999,
      }}
    >
      💬 Soporte
    </a>
  );
}