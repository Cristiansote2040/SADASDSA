import React from 'react';
import '../Styles/Components/ContactOverlay.css';

export default function ContactOverlay({ onClose, children }) {
  const handleWhatsApp = () => {
    window.open("https://wa.me/tu-numero-aca", "_blank");
  };

  return (
    <div className="overlay-master-container">
      {/* CAPA DEL MENSAJE */}
      <div className="contact-message-layer">
        <div className="message-card">
          {/* BOTÓN DE CERRAR (X) */}
          <button className="close-overlay-btn" onClick={onClose}>×</button>
          
          <span className="card-tag">PORTFOLIO PROJECT</span>
          <h2>¿Buscás este <span>sistema?</span></h2>
          <p>
            El registro y la validación funcionan perfectamente. 
            Si querés implementar este sistema de usuarios en tu negocio, 
            estoy listo para ayudarte.
          </p>
          
          <div className="card-actions">
            <button onClick={handleWhatsApp} className="btn-contact-main">
              CONTACTAR POR WHATSAPP
            </button>
          </div>
        </div>
      </div>

      {/* FONDO BORROSO */}
      <div className="original-content-blurred">
        {children}
      </div>
    </div>
  );
}