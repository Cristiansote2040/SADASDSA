import { Link } from "react-router-dom";
import '../Styles/Components/InfroBanner.css'
export default function InfoBanner() {
  return (
    <div
      className="info-banner-image"
      style={{
        backgroundImage: "url('https://thumbs.dreamstime.com/b/primer-plano-de-una-persona-retirando-manualmente-un-trozo-comida-crujiente-y-empanizado-plato-casera-informal-con-reconfortante-429758176.jpg')", // reemplazá con tu imagen
      }}
    >
      <div className="banner-content">
        <h3>¿Sabés cómo retirar y comprar tus productos?</h3>
        <p>
          Podés retirar tus productos en nuestra tienda o recibirlos en tu domicilio.
          Seguí los pasos para completar tu compra fácilmente y disfrutar de tus promociones.
        </p>
        <Link to="/Comprar" className="banner-btn">
          Mucho mas info
        </Link>
      </div>
    </div>
  );
}