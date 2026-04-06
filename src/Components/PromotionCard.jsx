import { Link } from "react-router-dom";
import '../Styles/Components/PromotionCard.css'

export default function PromotionCard({ promotion }) {
  return (
    <div className="hp-promo-card">
      {promotion.image && (
        <img
          src={promotion.image}
          alt={promotion.title}
          className="hp-promo-card__image"
        />
      )}
      <h3 className="hp-promo-card__title">{promotion.title}</h3>
      <p className="hp-promo-card__description">{promotion.description}</p>
      {promotion.discountPercentage && (
        <span className="hp-promo-card__badge">{promotion.discountPercentage}% OFF</span>
      )}
      <Link to="/products" className="hp-promo-card__btn">
        Ver productos
      </Link>
    </div>
  );
}