import { useContext, useState } from "react";
import { CartContext } from "../Context/Cartcontext";
import { AuthContext } from "../Context/AuthContext";
import { createPayment } from "../services/paymentService";
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage";
import ContactOverlay from "../Components/Contactame"; 
import { useNavigate } from "react-router-dom";
import "../Styles/Cheakout.css";

export default function Checkout() {
  const { cart, subtotal, promoDiscount, discount, totalFinal, couponCode } =
    useContext(CartContext);

  const { user, setMessage } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); 

  const navigate = useNavigate();

  // =========================
  // INICIAR PAGO
  // =========================
  const handlePayment = () => {
    // ❌ COMENTAMOS esto para que no te mande a la ErrorPage de "No autorizado"
    /*
    if (!user) {
      setMessage({ type: "error", text: "Debes iniciar sesión 🔐" });
      return setError({ code: "No autorizado", msg: "Debes iniciar sesión" });
    }
    */

    if (cart.length === 0) {
      setMessage({ type: "warning", text: "Tu carrito está vacío 😔" });
      // Quitamos el setError de acá también para que no se rompa la vista
      return; 
    }

    setMessage({ type: "info", text: "Confirmá tu compra 🛒" });
    setConfirmModal(true);
  };

  // =========================
  // CONFIRMAR PAGO
  // =========================
  const confirmPayment = async () => {
    setConfirmModal(false);

    // ✅ Activamos el cartel de contacto directamente
    setShowOverlay(true);
    
    // El return evita que se ejecute el código de abajo (Mercado Pago),
    // pero el código sigue ahí intacto.
    return; 

    // eslint-disable-next-line no-unreachable
    setLoading(true);
    try {
      const itemsToSend = cart.map((item) => ({
        product: item.product || item._id,
        variant: item.variant,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      const data = await createPayment({ items: itemsToSend, couponCode });
      window.location.href = data.init_point;
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Procesando tu pago..." />;
  
  // Este es el que te estaba bloqueando:
  if (error) return <ErrorPage code={error.code} msg={error.msg} />;

  const checkoutJSX = (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      {cart.length === 0 ? (
        <div className="checkout-empty">
          <p>No hay productos en el carrito 😔</p>
        </div>
      ) : (
        <div className="checkout-container">
          <ul className="checkout-items">
            {cart.map((item) => (
              <li key={item._id + item.variant} className="checkout-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-totals">
            <p>Subtotal: <span>${subtotal}</span></p>
            {promoDiscount > 0 && <p className="promo">Promociones: <span>-${promoDiscount}</span></p>}
            {discount > 0 && couponCode && <p className="coupon">Cupón ({couponCode}): <span>-${discount}</span></p>}
            <p className="checkout-total">Total final: <span>${totalFinal}</span></p>
          </div>

          <button className="checkout-pay" onClick={handlePayment}>
            Pagar
          </button>
        </div>
      )}

      {confirmModal && (
        <div className="checkout-modal-backdrop">
          <div className="checkout-modal">
            <h3>¿Confirmar pago?</h3>
            <div className="checkout-modal-buttons">
              <button onClick={() => setConfirmModal(false)}>Cancelar</button>
              <button className="confirm" onClick={confirmPayment}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="checkout-wrapper">
      {showOverlay ? (
        <ContactOverlay onClose={() => setShowOverlay(false)}>
          {checkoutJSX}
        </ContactOverlay>
      ) : (
        checkoutJSX
      )}
    </div>
  );
}