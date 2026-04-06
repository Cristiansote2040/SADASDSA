
import '../Styles/Footer.css'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Info nuestra */}
        <div className="footer-section">
          <h4>Info nuestra</h4>
          <ul>
            <li><a href="/about">Quiénes somos</a></li>
            <li><a href="/faq">Preguntas</a></li>
          </ul>
        </div>

        {/* Cómo comprar */}
        <div className="footer-section">
          <h4>Cómo comprar</h4>
          <ul>
            <li><a href="/shipping">Envíos y retiros</a></li>
            <li><a href="/payment">Medios de pago</a></li>
            <li><a href="/promotions">Promociones</a></li>
          </ul>
        </div>

        {/* Productos */}
        <div className="footer-section">
          <h4>Productos</h4>
          <ul>
            <li><a href="/products">Todos los productos</a></li>
            <li><a href="/categories">Por categoría</a></li>
            <li><a href="/top-selling">Más vendidos</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-section">
          <h4>Contacto</h4>
          <ul>
            <li><a href="https://wa.me/5491123456789" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="/where-we-are">Dónde estamos</a></li>
          </ul>
        </div>
      </div>

      <p className="footer-copy">© 2026 Pique Picante. Todos los derechos reservados.</p>
    </footer>
  );
}