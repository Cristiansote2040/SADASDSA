import { useEffect, useState, useContext } from "react";
import { getProfile } from "../services/userService";
import { getMyOrders } from "../services/orderService";
import { AuthContext } from "../Context/AuthContext"; // 🔥
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage";
import "../Styles/Profile.css";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setMessage } = useContext(AuthContext); // 🔥 GLOBAL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await getProfile();

        setUser(profileRes?.data || {});
        setForm({
          name: profileRes?.data?.name || "",
          email: profileRes?.data?.email || "",
          password: "",
        });

        const ordersRes = await getMyOrders();
        setOrders(ordersRes?.data || []);
      } catch (err) {
        console.error(err);

        setError({
          code: err.response?.status || 500,
          message: "Error cargando datos",
        });

        // 🔥 NOTIFICACIÓN ERROR
        setMessage({
          type: "error",
          text: "Error cargando tu perfil ❌",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setMessage]);

  if (loading) return <Loading text="Cargando..." />;
  if (error) return <ErrorPage code={error.code} message={error.message} />;

  const now = new Date();

  const daysRemaining = (pickupEndTime) =>
    pickupEndTime
      ? Math.ceil((new Date(pickupEndTime) - now) / (1000 * 60 * 60 * 24))
      : null;

  const completedOrders = orders.filter((o) => o.status === "entregado");

  const preparingAndReady = orders.filter(
    (o) =>
      o.status === "en preparación" ||
      o.status === "listo para retirar"
  );

  const pendingOrders = orders.filter(
    (o) =>
      !["entregado", "en preparación", "listo para retirar"].includes(
        o.status
      )
  );

  // 🔥 GUARDAR PERFIL
  const handleSave = () => {
    setEditing(false);

    setMessage({
      type: "success",
      text: "Perfil actualizado correctamente 👤✨",
    });
  };

  return (
    <div className="prf-container">

      {/* PERFIL */}
      <div className="prf-header">
        {!editing ? (
          <>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>

            <button
              className="prf-edit-btn"
              onClick={() => {
                setEditing(true);

                setMessage({
                  type: "info",
                  text: "Editando perfil ✏️",
                });
              }}
            >
              Editar perfil
            </button>
          </>
        ) : (
          <div className="prf-edit-form">
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Nombre"
            />

            <input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Email"
            />

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Nueva contraseña"
            />

            <div className="prf-edit-actions">
              <button onClick={handleSave}>
                Guardar
              </button>

              <button
                onClick={() => {
                  setEditing(false);

                  setMessage({
                    type: "warning",
                    text: "Edición cancelada ⚠️",
                  });
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* INFO PICKUP */}
      <div className="prf-pickup-banner">
        ⚠️ <strong>Atención:</strong> Sus pedidos estarán disponibles para
        retirar en nuestra tienda desde <strong>10:00 AM hasta 7:00 PM</strong>

        <p className="prf-pickup-subtext">
          Espere nuestra confirmación y luego se le asignará un código para
          retirar su compra.
        </p>

        <button
          className="prf-pickup-btn"
          onClick={() =>
            setMessage({
              type: "info",
              text: "Revisá las condiciones de pago y retiro 🏪",
            })
          }
        >
          Ver más sobre cómo pagar y retirar
        </button>
      </div>

      {/* COMPLETADAS */}
      <h3>Completadas</h3>
      <div className="prf-orders-list">
        {completedOrders.map((order) => (
          <div key={order._id} className="prf-order-card prf-completed-card">
            <div className="prf-order-id">ID: {order._id}</div>

            <div className="prf-order-items">
              {order.items?.map((item) => (
                <div key={item._id}>
                  {item.product.name} x {item.quantity}
                </div>
              ))}
            </div>

            <div className="prf-order-price">
              Total: ${order.totalPrice}
            </div>

            <div className="prf-order-status">
              {order.status}
            </div>
          </div>
        ))}
      </div>

      {/* PREPARACIÓN */}
      <h3>En preparación / Listo para retirar</h3>
      <div className="prf-orders-list">
        {preparingAndReady.map((order) => {
          const remaining = daysRemaining(order.pickupEndTime);
          const isPickup = order.status === "listo para retirar";

          return (
            <div
              key={order._id}
              className={`prf-order-card ${
                isPickup
                  ? "prf-highlight-pickup"
                  : "prf-preparing-card"
              }`}
            >
              <div className="prf-order-id">ID: {order._id}</div>

              <div className="prf-order-items">
                {order.items?.map((item) => (
                  <div key={item._id}>
                    {item.product.name} x {item.quantity}
                  </div>
                ))}
              </div>

              <div className="prf-order-price">
                Total: ${order.totalPrice}
              </div>

              <div className="prf-order-status">
                {order.status}
              </div>

              {isPickup && (
                <div className="prf-pickup-info">
                  Código: {order.pickupCode || "Pendiente"}
                  <br />
                  {remaining > 0
                    ? `Días restantes: ${remaining}`
                    : "Último día"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PENDIENTES */}
      <h3>En espera / Expiradas</h3>
      <div className="prf-orders-list">
        {pendingOrders.map((order) => (
          <div key={order._id} className="prf-order-card prf-pending-card">
            <div className="prf-order-id">ID: {order._id}</div>

            <div className="prf-order-items">
              {order.items?.map((item) => (
                <div key={item._id}>
                  {item.product.name} x {item.quantity}
                </div>
              ))}
            </div>

            <div className="prf-order-price">
              Total: ${order.totalPrice}
            </div>

            <div className="prf-order-status">
              {order.status}
            </div>

            {order.pickupEndTime && (
              <div className="prf-pickup-info">
                Finalizó el{" "}
                {new Date(order.pickupEndTime).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}