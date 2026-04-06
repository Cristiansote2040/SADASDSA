import { useEffect, useState, useContext } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { Link } from "react-router-dom";
import ErrorPage from "../Components/ErrorPage";
import ModalConfirm from "../Components/ModalConfirm";
import { AuthContext } from "../Context/AuthContext"; // 🔥
import "../Styles/AdminProducts.css";

export default function AdminProductsNew() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { setMessage } = useContext(AuthContext); // 🔥

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.products);
      } catch (err) {
        // 🚨 error grave
        setError({
          code: "Error",
          msg: "No se pudieron cargar los productos.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    // 🔥 mensaje antes de eliminar
    setMessage({
      type: "waiting",
      text: "Eliminando producto...",
    });

    try {
      await deleteProduct(productToDelete._id);

      setProducts((prev) =>
        prev.filter((p) => p._id !== productToDelete._id)
      );

      setMessage({
        type: "success",
        text: "Producto eliminado 🗑️",
      });

      setShowModal(false);
      setProductToDelete(null);
    } catch (err) {
      // ⚠️ error normal
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "No se pudo eliminar el producto ❌",
      });
    }
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) return <ErrorPage code={error.code} msg={error.msg} />;

  return (
    <div className="admin-products-new-container">
      <h2 className="admin-products-new-title">
        Productos (Panel Admin)
      </h2>

      {loading ? (
        <p className="admin-products-new-loading">
          Cargando productos...
        </p>
      ) : products.length === 0 ? (
        <p className="admin-products-new-empty">
          No hay productos
        </p>
      ) : (
        <div className="admin-products-new-grid">
          {products.map((p) => (
            <div key={p._id} className="admin-product-card">
              <img
                src={p.image}
                alt={p.name}
                className="admin-product-image"
              />

              <div className="admin-product-info">
                <h3>{p.name}</h3>

                <p>
                  <strong>Precio:</strong> $
                  {p.variants?.[0]?.price}
                </p>

                <p>
                  <strong>Stock:</strong>{" "}
                  {p.variants?.[0]?.stock}
                </p>

                {p.tags?.length > 0 && (
                  <p>
                    <strong>Tags:</strong>{" "}
                    {p.tags.join(", ")}
                  </p>
                )}

                <p>
                  <strong>Estado:</strong>{" "}
                  {p.isActive ? "Activo" : "Inactivo"}
                </p>

                <p>
                  <strong>Creado:</strong>{" "}
                  {formatDate(p.createdAt)}
                </p>

                <p>
                  <strong>Última modificación:</strong>{" "}
                  {formatDate(p.updatedAt)}
                </p>
              </div>

              <div className="admin-product-actions">
                <Link to={`/admin/products/${p._id}`}>
                  <button className="btn-admin-edit">
                    Editar
                  </button>
                </Link>

                <button
                  className="btn-admin-delete"
                  onClick={() => handleDeleteClick(p)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/admin/products/new">
        <button className="btn-admin-create">
          Crear producto
        </button>
      </Link>

      <ModalConfirm
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Seguro querés eliminar "${productToDelete?.name}"?`}
      />
    </div>
  );
}