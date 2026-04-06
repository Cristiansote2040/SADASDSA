import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { CartContext } from "../Context/Cartcontext";
import { AuthContext } from "../Context/AuthContext"; // 🔥 IMPORTANTE
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage";
import "../Styles/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);
  const { setMessage } = useContext(AuthContext); // 🔥 usamos el sistema global

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Fetch producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const prod = res.data;

        setProduct(prod);

        const firstAvailableVariant = prod.variants?.find(
          (v) => v.stock > 0
        );

        setSelectedVariant(firstAvailableVariant?._id || null);
      } catch (err) {
        console.error(err);

        setError({
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "Error cargando el producto",
        });

        // 🔥 Notificación de error
        setMessage({
          type: "error",
          text: "Error al cargar el producto ❌",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, setMessage]);

  if (loading) return <Loading text="Cargando producto..." />;
  if (error) return <ErrorPage code={error.code} message={error.message} />;
  if (!product) return <p>No se encontró el producto.</p>;

  const variantObj = product.variants.find(
    (v) => v._id === selectedVariant
  );

  // 🔥 Cambiar variante
  const handleVariantChange = (variantId) => {
    setSelectedVariant(variantId);

    setMessage({
      type: "info",
      text: "Variante seleccionada 🔄",
    });
  };

  // 🔥 Agregar al carrito
  const handleAddToCart = () => {
    if (!variantObj) {
      setMessage({
        type: "error",
        text: "Seleccioná una variante ⚠️",
      });
      return;
    }

    if (variantObj.stock < quantity) {
      setMessage({
        type: "warning",
        text: "No hay suficiente stock 😢",
      });
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      image: product.image,

      price: variantObj.discountedPrice || variantObj.price,
      originalPrice: variantObj.price,

      quantity,
      variant: selectedVariant,
      stock: variantObj.stock,
    });

    // 🔥 NOTIFICACIÓN PRO
    setMessage({
      type: "success",
      text: "Producto agregado al carrito 🛒🔥",
    });

    setQuantity(1);
  };

  const outOfStock = !variantObj || variantObj.stock <= 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        {/* IMAGEN */}
        <div className="product-detail-image">
          {variantObj?.discountedPrice && (
            <span className="product-detail-badge">🔥 Oferta</span>
          )}
          <img src={product.image} alt={product.name} />
        </div>

        {/* INFO */}
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>

          <p className="product-detail-description">
            {product.description}
          </p>

          {/* VARIANTES */}
          {product.variants?.length > 0 && (
            <div className="product-detail-variants">
              {product.variants.map((v) => (
                <button
                  key={v._id}
                  className={selectedVariant === v._id ? "active" : ""}
                  disabled={v.stock <= 0}
                  onClick={() => handleVariantChange(v._id)}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}

          {/* 💸 PRECIO */}
          {variantObj?.discountedPrice && (
            <span className="product-detail-old">
              ${variantObj.price}
            </span>
          )}

          <span className="product-detail-new">
            ${variantObj?.discountedPrice || variantObj?.price}
          </span>

          {/* CANTIDAD */}
          <div className="product-detail-qty">
            <button
              onClick={() =>
                setQuantity(Math.max(1, quantity - 1))
              }
            >
              -
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity(quantity + 1)}>
              +
            </button>
          </div>

          {/* BOTON */}
          <button
            className="product-detail-buy"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            {outOfStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}