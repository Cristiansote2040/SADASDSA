import "../Styles/Home.css";
import { useEffect, useState } from "react";
import BannerManager from "../Components/ComponentsBanners/BannerManager";
import PromotionCard from "../components/PromotionCard";
import { getPromotions } from "../services/promotionService";
import { getProducts } from "../services/productService";
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage"; // 🔹 Importamos ErrorPage
import Carrusel from "../Components/Carrusel";
import CategorySection from "../Components/CategorySection";
import ContactBanner from "../Components/ContactBanner";
import BannerInfo from "../Components/BannerInfo";
import LocationSection from "../Components/LocationSection";

export default function Home() {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // 🔹 Estado para errores
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promotionsRes = await getPromotions();
        const productsRes = await getProducts({ isActive: true });

        setPromotions(promotionsRes.data);
        setProducts(productsRes.data.products);
      } catch (err) {
        setError("No se pudieron cargar los productos o promociones"); // 🔹 Mensaje de error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // 🔹 Top selling (más vendidos)
  const topSelling = [...products]
    .filter((p) => (p.variants || []).some((v) => v.stock > 0))
    .sort((a, b) => {
      const soldA = (a.variants || []).reduce(
        (acc, v) => acc + ((v.initialStock ?? 0) - v.stock),
        0,
      );
      const soldB = (b.variants || []).reduce(
        (acc, v) => acc + ((v.initialStock ?? 0) - v.stock),
        0,
      );
      return soldB - soldA;
    })
    .slice(0, 3);

  if (loading) {
    return <Loading text="Cargando la tienda..." />;
  }

  if (error) {
    return <ErrorPage message={error} />; // 🔹 Mostramos ErrorPage si hay error
  }

  return (
    <>
      <Carrusel></Carrusel>
      <BannerInfo></BannerInfo>

      <CategorySection></CategorySection>
      <BannerManager page="home" position="middle" />
      <LocationSection></LocationSection>
      <ContactBanner></ContactBanner>
      <div className="home-page">
        <section className="hp-promotions">
          <h2 className="hp-promotions__title">Promociones</h2>
          <p className="hp-promotions__intro">
            Descubre nuestras ofertas especiales de la semana. Aprovecha los
            descuentos y disfruta de productos únicos con precios exclusivos.
          </p>
          <div className="hp-promotions__list">
            {promotions.length === 0 ? (
              <p>No hay promociones activas</p>
            ) : (
              promotions.map((promo) => (
                <PromotionCard key={promo._id} promotion={promo} />
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
