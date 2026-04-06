import React from "react";
import "../Styles/Components/ModalConfirm.css";

export default function ModalConfirm({ show, onClose, onConfirm, message }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p>{message || "¿Estás seguro?"}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}