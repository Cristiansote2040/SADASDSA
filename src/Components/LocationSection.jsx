import "../Styles/Components/LocationSection.css";
import { Link } from "react-router-dom";

export default function LocationSection() {
  return (
    <section className="hp-location" id="Ubi">
      <h2 className="hp-location__title">📍 Estamos en el corazón de la ciudad</h2>
      <p className="hp-location__desc">
        Vení a visitarnos y descubrí todos nuestros productos en un espacio cómodo y moderno. 
        Nuestro equipo estará encantado de atenderte, mostrarte las promociones de la semana y 
        ayudarte a elegir lo que más te guste. ¡No te pierdas la experiencia completa!
      </p>

      <div className="hp-location__content">
        {/* Mapa */}
        <div className="hp-location__map-wrapper">
          <iframe
            className="hp-location__map"
            title="Ubicación de la tienda"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.937565243895!2d-58.38155918478259!3d-34.603684380459424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacc8b5f4e33%3A0x3f0f7d1cf56e8e7e!2sObelisco%2C%20C1073%20CABA%2C%20Argentina!5e0!3m2!1ses-419!2sus!4vYOUR_UNIQUE_EMBED_CODE"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* Información de horarios y botón */}
        <div className="hp-location__info">
          <h3 className="hp-location__info-title">Horario de atención</h3>
          <ul className="hp-location__hours">
            <li>Lunes a Viernes: 09:00 – 20:00</li>
            <li>Sábado: 10:00 – 18:00</li>
            <li>Domingo: Cerrado</li>
          </ul>
          <p className="hp-location__tip">
            Si no podés acercarte, podés explorar nuestra tienda online, aprovechar promociones y coordinar tus pedidos fácilmente. ¡Queremos que tengas la mejor experiencia!
          </p>
          <Link to="/comprar" className="hp-location__btn">
            Cómo comprar
          </Link>
        </div>
      </div>
    </section>
  );
}