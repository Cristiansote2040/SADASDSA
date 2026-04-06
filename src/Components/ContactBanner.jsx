import "../Styles/Components/ContactBanner.css";
import { motion } from "framer-motion";

export default function ContactBanner() {
    const phone = "5491123456789"; // 👈 tu número (con código país sin +)
  const message = "Hola! Tengo una consulta 👋";

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      className="contactBannerContainer"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bannerImages">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png" alt="WhatsApp" />
      </div>
      <h3>Consultas, quejas y pedidos</h3>
      <p>
        Escríbenos por WhatsApp para cualquier consulta, queja o pedido. Te
        respondemos rápido y con atención personalizada.
      </p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <button>Enviar WhatsApp</button>
      </a>
    </motion.div>
  );
}