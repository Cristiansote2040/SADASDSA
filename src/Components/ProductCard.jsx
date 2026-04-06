import { Link } from "react-router-dom";
import "../Styles/Components/ProductCard.css";

export default function ProductCard({ product }) {
  const hasStock = product.variants?.some((v) => v.stock > 0);

  // 🔥 Elegir la variante más barata
  const cheapestVariant = product.variants?.reduce((prev, curr) => {
    const prevPrice = prev.discountedPrice ?? prev.price;
    const currPrice = curr.discountedPrice ?? curr.price;
    return currPrice < prevPrice ? curr : prev;
  });

  const normalPrice = cheapestVariant?.price ?? 0;
  const promoPrice = cheapestVariant?.discountedPrice ?? null;

  const ahorro = promoPrice ? normalPrice - promoPrice : 0;
  const discount = promoPrice
    ? Math.round(((normalPrice - promoPrice) / normalPrice) * 100)
    : 0;

  // 🔥 Etiqueta de promoción
  let tag = null;
  if (product.is2x1) tag = "2x1";
  else if (discount > 0) tag = "OFERTA";

  return (
    <div className={`product-card ${!hasStock ? "no-stock" : ""}`}>
      {!hasStock && <div className="badge-stock">SIN STOCK</div>}

      <Link to={`/products/${product._id}`} className="card-link">
        <div className="image-container">
          <img src={product.image} alt={product.name} />

          {tag && <span className="badge-tag">{tag}</span>}

          {discount > 0 && <span className="badge-discount">-{discount}%</span>}
        </div>

        <div className="card-info">
          <h3>{product.name}</h3>

          {promoPrice ? (
            <div className="price-container">
              <span className="promo-price">${promoPrice}</span>
              <span className="original-price">${normalPrice}</span>
            </div>
          ) : (
            <p className="normal-price">${normalPrice}</p>
          )}
        </div>
      </Link>
    </div>
  );
}