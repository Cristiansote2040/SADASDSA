import { createContext, useState, useEffect } from "react";
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0); // cupón aplicado
  const [couponCode, setCouponCode] = useState(null); // código
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // LOAD carrito de localStorage
  // =========================
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    } catch (err) {
      setError("No se pudo cargar el carrito");
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // SAVE carrito en localStorage
  // =========================
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      (err);
    }
  }, [cart]);

  // =========================
  // RESET CUPÓN
  // Solo cuando el usuario modifica el carrito después de aplicar cupón
  // =========================
  const resetCoupon = () => {
    setDiscount(0);
    setCouponCode(null);
  };

  // =========================
  // FUNCIONES DE CARRITO
  // =========================
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find(
        (i) => i._id === item._id && i.variant === item.variant
      );

      if (exists) {
        return prev.map((i) =>
          i._id === item._id && i.variant === item.variant
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });

    resetCoupon(); // 🔥 se resetea porque cambió carrito
  };

  const removeFromCart = (id, variant = null) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i._id === id && (variant ? i.variant === variant : true))
      )
    );
    resetCoupon();
  };

  const updateQuantity = (id, quantity, variant = null) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id && (variant ? i.variant === variant : true)
          ? { ...i, quantity: Number(quantity) }
          : i
      )
    );
    resetCoupon();
  };

  const clearCart = () => {
    setCart([]);
    resetCoupon();
  };

  // =========================
  // 💰 CALCULOS DINÁMICOS
  // =========================
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.quantity,
    0
  );

  const promoDiscount = cart.reduce((acc, item) => {
    const original = item.originalPrice || item.price;
    const diff = original - item.price;
    return acc + diff * item.quantity;
  }, 0);

  const subtotalWithPromo = subtotal - promoDiscount;

  const totalFinal = Math.max(0, subtotalWithPromo - discount);

  // =========================
  // 🎟 CUPÓN
  // =========================
  const applyDiscount = (amount, code = null) => {
    setDiscount(amount);
    setCouponCode(code);
  };

  // =========================
  // RENDER
  // =========================
  if (loading) return <Loading />;
  if (error) return <ErrorPage msg={error} showHome={true} />;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        subtotal,
        promoDiscount,
        subtotalWithPromo,
        discount,
        totalFinal,
        couponCode,

        applyDiscount,
        resetCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};