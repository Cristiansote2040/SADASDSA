import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ComoComprar.css";

const steps = [
  {
    title: "Elegí tus productos",
    text: "Explorá nuestra colección completa de productos y agregá lo que más te guste al carrito. Recordá: si recargás la página, el carrito se vacía automáticamente. Aprovechá cupones y promociones antes de finalizar tu compra.",
  },
  {
    title: "Aplicá tus cupones",
    text: "Si tenés un cupón, ingresalo en el carrito y el descuento se aplicará automáticamente al total final. Es rápido y sencillo de usar.",
  },
  {
    title: "Pagá con Mercado Pago",
    text: "Al finalizar la compra, serás redirigido a Mercado Pago para pagar con tarjeta o cuenta. Todo es seguro y confiable. Una vez pagado, recibirás la confirmación de tu pedido.",
  },
  {
    title: "Seguimiento de pedidos",
    text: "Desde tu cuenta, podés ver el estado de tus pedidos: Pendiente (lo estamos preparando), Listo para retirar (ya disponible en la tienda), Completado (pedido entregado) o Expirado.",
  },
  {
    title: "Retiro en tienda",
    text: "Cuando tu pedido esté listo, recibirás un código válido por 7 días. Mostrá el código en la tienda y retiralo en el horario disponible.",
  },
  {
    title: "📍 Nuestra ubicación",
    text: "", // último paso se renderiza con bloques
  },
];

export default function ComoComprarSlider() {
  const [current, setCurrent] = useState(0);
  const [animateBlocks, setAnimateBlocks] = useState(false);

  useEffect(() => {
    if (current === steps.length - 1) {
      setAnimateBlocks(false);
      setTimeout(() => setAnimateBlocks(true), 100);
    }
  }, [current]);

  const nextStep = () => {
    if (current < steps.length - 1) setCurrent(current + 1);
  };
  const prevStep = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="slider-page">
      {/* Timeline vertical */}
      <div className="timeline">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`timeline-dot ${i <= current ? "active" : ""}`}
          >
            <span className="timeline-number">{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Slides */}
      <div className="slide-container">
        {current < steps.length - 1 ? (
          <div className="slide">
            <h2 className="slide-title">{steps[current].title}</h2>
            <p className="slide-text">{steps[current].text}</p>
            <div className="nav-buttons">
              {current > 0 && <button onClick={prevStep}>Anterior</button>}
              {current < steps.length - 1 && (
                <button onClick={nextStep}>Siguiente</button>
              )}
            </div>
          </div>
        ) : (
          <div className="slide ultimo-step">
            <h2 className="slide-title">{steps[current].title}</h2>

            <p className={`slide-text block ${animateBlocks ? "show" : ""}`}>
              Vení a visitarnos y descubrí todos nuestros productos en un
              espacio cómodo y moderno. Nuestro equipo estará encantado de
              atenderte, mostrarte las promociones de la semana y ayudarte a
              elegir lo que más te guste. ¡No te pierdas la experiencia
              completa!
            </p>

            <div className={`map-wrapper block ${animateBlocks ? "show" : ""}`}>
              <iframe
                className="map"
                title="Ubicación de la tienda"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.937565243895!2d-58.38155918478259!3d-34.603684380459424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacc8b5f4e33%3A0x3f0f7d1cf56e8e7e!2sObelisco%2C%20C1073%20CABA%2C%20Argentina!5e0!3m2!1ses-419!2sus!4vYOUR_UNIQUE_EMBED_CODE"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>

            <div className={`info block ${animateBlocks ? "show" : ""}`}>
              <h3>Horario de atención</h3>
              <ul>
                <li>Lunes a Viernes: 09:00 – 20:00</li>
                <li>Sábado: 10:00 – 18:00</li>
                <li>Domingo: Cerrado</li>
              </ul>
              <p>
                Si no podés acercarte, podés explorar nuestra tienda online,
                aprovechar promociones y coordinar tus pedidos fácilmente.
                ¡Queremos que tengas la mejor experiencia!
              </p>
              <Link to="/how-to-buy" className="btn">
                Cómo comprar
              </Link>
            </div>

            <div className="nav-buttons">
              {current > 0 && <button onClick={prevStep}>Anterior</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
