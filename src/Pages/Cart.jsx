import { useContext, useState, useEffect } from "react";
import { CartContext } from "../Context/Cartcontext";
import { AuthContext } from "../Context/AuthContext"; // 🔥
import { useNavigate } from "react-router-dom";
import ErrorPage from "../Components/ErrorPage";
import CartItem from "../Components/CartItem";
import { applyCoupon } from "../services/couponService";
import "../Styles/Cart.css";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    applyDiscount,
    discount,
    couponCode,
    subtotal,
    promoDiscount,
    subtotalWithPromo,
    totalFinal,
  } = useContext(CartContext);

  const { setMessage } = useContext(AuthContext); // 🔥

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (!cart) throw new Error("Error cargando el carrito");
      } catch (err) {
        setError({ code: "Carrito vacío", msg: err.message });

        // 🔥 Notificación error
        setMessage({
          type: "error",
          text: "Error cargando el carrito ❌",
        });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cart, setMessage]);

  // =========================
  // CUPÓN
  // =========================
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setMessage({
        type: "warning",
        text: "Escribí un cupón 😅",
      });
      return;
    }

    setCouponLoading(true);

    try {
      const res = await applyCoupon(
        couponInput.trim(),
        subtotalWithPromo
      );

      // 🔥 guardar en contexto
      applyDiscount(res.data.discount, res.data.coupon);

      // 🔥 NOTIFICACIÓN PRO
      setMessage({
        type: "success",
        text: `Cupón aplicado (${res.data.coupon}) -$${res.data.discount} 💸`,
      });

      setCouponInput(""); // limpiar input
    } catch (err) {
      const msg =
        err.response?.data?.message || "Error aplicando cupón";

      setError({
        code: "Error al aplicar cupón",
        msg,
      });

      // 🔥 Notificación error
      setMessage({
        type: "error",
        text: msg,
      });
    } finally {
      setCouponLoading(false);
    }
  };

  // =========================
  // NAVIGACIÓN
  // =========================
  const handleCheckout = () => {
    if (cart.length === 0) {
      setMessage({
        type: "warning",
        text: "Tu carrito está vacío 😔",
      });
      return;
    }

    setMessage({
      type: "info",
      text: "Redirigiendo al pago 💳",
    });

    navigate("/checkout");
  };

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <ErrorPage code={error.code} msg={error.msg} />;

  return (
    <div className="cart-page">
      <h2 className="cart-title">Tu carrito</h2>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>El carrito está vacío 😔</p>
          <button onClick={() => navigate("/")}>
            Seguir comprando
          </button>
        </div>
      ) : (
        <div className="cart-container">

          {/* ITEMS */}
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem
                key={item._id + item.variant}
                item={item}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* RESUMEN */}
          <div className="cart-summary">
            <h3>Resumen de compra</h3>

            {/* CUPÓN */}
            <div className="cart-coupon">
              <input
                type="text"
                placeholder="Código de cupón"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={couponLoading}
              >
                {couponLoading ? "Aplicando..." : "Aplicar"}
              </button>
            </div>

            {/* 💸 TOTALES */}
            <div className="cart-totals">

              <p>
                Subtotal:
                <span>${subtotal}</span>
              </p>

              {promoDiscount > 0 && (
                <p className="cart-discount promo">
                  Descuento promociones:
                  <span>-${promoDiscount}</span>
                </p>
              )}

              {promoDiscount > 0 && (
                <p>
                  Subtotal con promos:
                  <span>${subtotalWithPromo}</span>
                </p>
              )}

              {discount > 0 && (
                <p className="cart-discount coupon">
                  Descuento ({couponCode}):
                  <span>-${discount}</span>
                </p>
              )}

              <p className="cart-total">
                Total:
                <span>${totalFinal}</span>
              </p>

            </div>

            <button
              className="cart-pay"
              onClick={handleCheckout}
            >
              Ir a pagar
            </button>
          </div>

        </div>
      )}
    </div>
  );
}