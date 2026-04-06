import { useEffect, useState } from "react";
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../services/promotionService";
import { getProducts } from "../services/productService";
import ErrorPage from "../Components/ErrorPage";
import "../Styles/AdminPromotions.css";

export default function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    products: [],
    startDate: "",
    endDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================== FETCH =====================
  const fetchData = async () => {
    try {
      const [promosRes, productsRes] = await Promise.all([
        getPromotions(),
        getProducts(),
      ]);

      // ✅ Aquí usamos .data directamente, no .data.products
      setPromos(Array.isArray(promosRes.data) ? promosRes.data : []);
      setProducts(
        Array.isArray(productsRes.data.products)
          ? productsRes.data.products
          : [],
      );
    } catch (err) {
      console.error(err);
      setError({ code: "Error", msg: "No se pudieron cargar los datos." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===================== HANDLE DELETE =====================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro querés eliminar esta promoción?")) return;
    try {
      await deletePromotion(id);
      setPromos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError({ code: "Error", msg: "No se pudo eliminar la promoción." });
    }
  };

  // ===================== HANDLE SUBMIT =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updatePromotion(editingId, form);
        setPromos((prev) =>
          prev.map((p) => (p._id === editingId ? res.data : p)),
        );
      } else {
        const res = await createPromotion(form);
        setPromos((prev) => [...prev, res.data]);
      }

      setForm({
        title: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        products: [],
        startDate: "",
        endDate: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError({ code: "Error", msg: "No se pudo guardar la promoción." });
    }
  };

  // ===================== HANDLE EDIT =====================
  const handleEdit = (promo) => {
    setForm({
      title: promo.title,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      products: promo.products.map((p) => p._id),
      startDate: promo.startDate ? promo.startDate.slice(0, 10) : "",
      endDate: promo.endDate ? promo.endDate.slice(0, 10) : "",
    });
    setEditingId(promo._id);
  };

  if (error) return <ErrorPage code={error.code} msg={error.msg} />;
  const getMaxDiscount = () => {
    if (form.discountType === "percentage") return 100;

    if (form.discountType === "fixed") {
      const selectedProducts = products.filter((p) =>
        form.products.includes(p._id),
      );

      if (selectedProducts.length === 0) return 0;

      // agarramos el menor precio entre productos/variantes
      let minPrice = Infinity;

      selectedProducts.forEach((p) => {
        if (p.variants && p.variants.length > 0) {
          p.variants.forEach((v) => {
            if (v.price < minPrice) minPrice = v.price;
          });
        } else {
          if (p.price < minPrice) minPrice = p.price;
        }
      });

      return minPrice === Infinity ? 0 : minPrice;
    }

    return 0;
  };

  // ===================== RENDER =====================
  return (
    <div className="admin-promotions-container">
      <h2 className="admin-promotions-title">Promociones (Admin)</h2>

      {/* ===== FORMULARIO ===== */}
      <form onSubmit={handleSubmit} className="admin-promo-form">
        <input
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="admin-promo-input"
        />
        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="admin-promo-textarea"
        />

        <select
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          className="admin-promo-select"
        >
          <option value="percentage">Porcentaje (%)</option>
          <option value="fixed">Monto fijo ($)</option>
        </select>

        <input
          type="number"
          placeholder={
            form.discountType === "percentage" ? "Valor %" : "Monto fijo $"
          }
          value={form.discountValue}
          onChange={(e) =>
            setForm({ ...form, discountValue: Number(e.target.value) })
          }
          required
          min={1}
          max={getMaxDiscount()} // 🔥 CLAVE
          className="admin-promo-input"
        />

        <select
          multiple
          value={form.products}
          onChange={(e) =>
            setForm({
              ...form,
              products: Array.from(e.target.selectedOptions, (o) => o.value),
            })
          }
          className="admin-promo-multiselect"
        >
          {Array.isArray(products) &&
            products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}{" "}
                {p.variants && p.variants.length > 0
                  ? `(${p.variants.map((v) => v.price).join(" / ")})`
                  : p.price}
              </option>
            ))}
        </select>

        <label className="admin-promo-label">
          Fecha inicio
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="admin-promo-input"
          />
        </label>
        <label className="admin-promo-label">
          Fecha fin
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="admin-promo-input"
          />
        </label>

        <button type="submit" className="admin-promo-button">
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* ===== LISTADO PROMOS ===== */}
      <div className="admin-promo-list">
        {loading ? (
          <p>Cargando promociones...</p>
        ) : promos.length === 0 ? (
          <p>No hay promociones</p>
        ) : (
          promos.map((promo) => (
            <div key={promo._id} className="admin-promo-card">
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
              <p>
                Tipo: {promo.discountType === "percentage" ? "%" : "$"} | Valor:{" "}
                {promo.discountValue}
              </p>
              <p>
                Productos:{" "}
                {Array.isArray(promo.products) && promo.products.length > 0
                  ? promo.products
                      .map((prodId) => {
                        // 🔥 Soporta string u objeto
                        const id =
                          typeof prodId === "object" ? prodId._id : prodId;

                        const prod = products.find(
                          (p) => p._id.toString() === id.toString(),
                        );

                        if (!prod) return null;

                        // ✅ Si tiene variantes
                        if (prod.variants?.length > 0) {
                          return prod.variants
                            .map(
                              (v) =>
                                `${prod.name} - ${v.name}: ${v.price}${
                                  v.discountedPrice
                                    ? ` → ${v.discountedPrice}`
                                    : ""
                                }`,
                            )
                            .join(" / ");
                        }

                        // ✅ fallback (por si algún producto no tiene variantes)
                        return `${prod.name}`;
                      })
                      .filter(Boolean)
                      .join(", ")
                  : "Sin productos"}
              </p>
              <p>
                Fechas: {promo.startDate?.slice(0, 10)} -{" "}
                {promo.endDate?.slice(0, 10)}
              </p>
              <button
                onClick={() => handleEdit(promo)}
                className="admin-promo-edit-btn"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(promo._id)}
                className="admin-promo-delete-btn"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
