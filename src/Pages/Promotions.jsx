// src/Pages/Promotions.jsx
import { useEffect, useState } from "react";
import { getPromotions } from "../services/promotionService";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage";
import "../styles/Promotions.css";

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await getPromotions();
        setPromotions(res.data);
      } catch (err) {
        console.error(err);
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Error cargando promociones",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading) return <Loading text="Cargando nuestras promociones 🔥" />;
  if (error) return <ErrorPage code={error.code} message={error.message} />;

  return (
    <div className="promotions-page">
      <header className="promo-header">
        <h1>Promociones Especiales 🍽️</h1>
        <p>
          Descubrí nuestras ofertas del día y disfrutá de sabores increíbles
          con descuentos irresistibles para todos los gustos.
        </p>
      </header>

      {promotions.length === 0 ? (
        <p className="no-promos">Actualmente no hay promociones activas 😔</p>
      ) : (
        <div className="promo-grid">
          {promotions.map((promo) => (
            <div key={promo._id} className="promo-card">
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
              <p className="discount">Descuento: {promo.discountPercentage}%</p>
              <Link to="/products" className="promo-link">
                Ver productos
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}