import { useEffect, useState, useContext } from "react";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../services/couponService";
import { AuthContext } from "../Context/AuthContext"; // 🔥
import ErrorPage from "../Components/ErrorPage";
import ModalConfirm from "../Components/ModalConfirm";
import "../Styles/AdminCoupons.css";

export default function AdminCouponsFull() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxUses: "",
    expiresAt: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const { setMessage } = useContext(AuthContext); // 🔥

  // =====================
  // FETCH (ERROR GLOBAL)
  // =====================
  const fetchCoupons = async () => {
    try {
      const res = await getCoupons();
      setCoupons(res.data);
    } catch (err) {

      // 🚨 ERROR GRAVE → ErrorPage
      setError({
        code: "Error",
        msg: "No se pudieron cargar los cupones.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // =====================
  // FORM
  // =====================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        type: form.discountType === "percentage" ? "percent" : "fixed",
        value: Number(form.discountValue),
        minPurchase: Number(form.minPurchase || 0),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt
          ? new Date(form.expiresAt)
          : undefined,
        active: true,
      };

      if (editingId) {
        await updateCoupon(editingId, payload);

        setMessage({
          type: "success",
          text: "Cupón actualizado ✏️",
        });
      } else {
        await createCoupon(payload);

        setMessage({
          type: "success",
          text: "Cupón creado 🎉",
        });
      }

      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minPurchase: "",
        maxUses: "",
        expiresAt: "",
      });

      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      console.error(err);

      // ⚠️ ERROR NORMAL → toast
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Error guardando cupón ❌",
      });
    }
  };

  // =====================
  // EDIT
  // =====================
  const handleEdit = (coupon) => {
    setForm({
      code: coupon.code,
      discountType:
        coupon.type === "percent" ? "percentage" : "fixed",
      discountValue: coupon.value,
      minPurchase: coupon.minPurchase,
      maxUses: coupon.maxUses,
      expiresAt: coupon.expiresAt
        ? coupon.expiresAt.slice(0, 10)
        : "",
    });

    setEditingId(coupon._id);

    setMessage({
      type: "info",
      text: "Editando cupón ✏️",
    });
  };

  // =====================
  // DELETE
  // =====================
  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCoupon(couponToDelete._id);

      setCoupons((prev) =>
        prev.filter((c) => c._id !== couponToDelete._id)
      );

      setShowModal(false);
      setCouponToDelete(null);

      setMessage({
        type: "success",
        text: "Cupón eliminado 🗑️",
      });
    } catch (err) {

      setMessage({
        type: "error",
        text: "Error eliminando cupón ❌",
      });
    }
  };

  // =====================
  // SEPARACIÓN 🔥
  // =====================
  const activeCoupons = coupons.filter((c) => c.active);
  const inactiveCoupons = coupons.filter((c) => !c.active);

  // =====================
  // FORMAT DATE
  // =====================
  const formatDate = (iso) => {
    if (!iso) return "-";
    const date = new Date(iso);
    return (
      date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("es-AR")
    );
  };

  if (error) return <ErrorPage code={error.code} msg={error.msg} />;

  return (
    <div className="admin-coupons-full-container">
      <h2 className="admin-coupons-full-title">
        Cupones (Panel Admin)
      </h2>

      {/* FORM */}
      <form
        className="admin-coupons-full-form"
        onSubmit={handleSubmit}
      >
        <input
          name="code"
          placeholder="Código"
          value={form.code}
          onChange={handleChange}
          required
        />

        <select
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
        >
          <option value="percentage">Porcentaje</option>
          <option value="fixed">Monto fijo</option>
        </select>

        <input
          name="discountValue"
          type="number"
          placeholder="Valor descuento"
          value={form.discountValue}
          onChange={handleChange}
          required
        />

        <input
          name="minPurchase"
          type="number"
          placeholder="Compra mínima"
          value={form.minPurchase}
          onChange={handleChange}
        />

        <input
          name="maxUses"
          type="number"
          placeholder="Máx usos"
          value={form.maxUses}
          onChange={handleChange}
        />

        <input
          name="expiresAt"
          type="date"
          value={form.expiresAt}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId
            ? "Actualizar cupón"
            : "Crear cupón"}
        </button>
      </form>

      <hr />

      {/* 🔥 ACTIVOS */}
      <h3 className="admin-section-title">Activos</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : activeCoupons.length === 0 ? (
        <p>No hay cupones activos</p>
      ) : (
        <div className="admin-coupons-grid">
          {activeCoupons.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              handleEdit={handleEdit}
              handleDeleteClick={handleDeleteClick}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* 🔥 INACTIVOS */}
      <h3 className="admin-section-title">Inactivos</h3>

      {inactiveCoupons.length === 0 ? (
        <p>No hay cupones inactivos</p>
      ) : (
        <div className="admin-coupons-grid inactive">
          {inactiveCoupons.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              handleEdit={handleEdit}
              handleDeleteClick={handleDeleteClick}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      <ModalConfirm
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Seguro querés eliminar "${couponToDelete?.code}"?`}
      />
    </div>
  );
}

// 🔥 COMPONENTE reutilizable
function CouponCard({ coupon, handleEdit, handleDeleteClick, formatDate }) {
  return (
    <div className="admin-coupon-card">
      <div className="admin-coupon-header">
        <h3>{coupon.code}</h3>
        <span
          className={`badge-type ${
            coupon.type === "percent"
              ? "percent"
              : "fixed"
          }`}
        >
          {coupon.type === "percent" ? "%" : "$"}
        </span>
      </div>

      <p>
        <strong>Descuento:</strong> {coupon.value}
        {coupon.type === "percent" ? "%" : "$"}
      </p>

      <p>
        <strong>Usos:</strong> {coupon.uses || 0} /{" "}
        {coupon.maxUses || "∞"}
      </p>

      <p>
        <strong>Estado:</strong>{" "}
        {coupon.active ? "Activo" : "Inactivo"}
      </p>

      <p>
        <strong>Compra mínima:</strong> $
        {coupon.minPurchase || 0}
      </p>

      <p>
        <strong>Vence:</strong>{" "}
        {formatDate(coupon.expiresAt)}
      </p>

      <p>
        <strong>Creado:</strong>{" "}
        {formatDate(coupon.createdAt)}
      </p>

      <p>
        <strong>Última modificación:</strong>{" "}
        {formatDate(coupon.updatedAt)}
      </p>

      <div className="admin-coupon-actions">
        <button
          className="btn-edit"
          onClick={() => handleEdit(coupon)}
        >
          Editar
        </button>

        <button
          className="btn-delete"
          onClick={() => handleDeleteClick(coupon)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}