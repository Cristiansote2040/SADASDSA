import React from "react";
import '../Styles/Components/CartItem.css'

export default function CartItem({ item, removeFromCart, updateQuantity }) {
  const outOfStock = item.stock <= 0;

  // 🔥 detectar promo correctamente
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  return (
    <div className="cart-item-card">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />

        {outOfStock && (
          <span className="cart-item-badge-stock">Sin stock</span>
        )}

        {hasDiscount && (
          <span className="cart-item-badge-promo">🔥 Oferta</span>
        )}
      </div>

      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>

        {/* 💸 PRECIO */}
        <div className="cart-item-price">
          {hasDiscount && (
            <span className="cart-item-old">
              ${item.originalPrice}
            </span>
          )}

          <span className="cart-item-new">
            ${item.price}
          </span>
        </div>

        {/* 🔢 CANTIDAD */}
        <div className="cart-item-quantity">
          <button
            onClick={() =>
              updateQuantity(item._id, Math.max(1, item.quantity - 1), item.variant)
            }
            disabled={outOfStock}
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() =>
              updateQuantity(
                item._id,
                Math.min(item.stock, item.quantity + 1),
                item.variant
              )
            }
            disabled={outOfStock}
          >
            +
          </button>
        </div>

        {/* ❌ ELIMINAR */}
        <button
          className="cart-item-remove"
          onClick={() => removeFromCart(item._id, item.variant)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}