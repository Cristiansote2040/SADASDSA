import { useEffect, useState, useContext } from "react";
import { getOrders, updateOrderStatus } from "../services/orderService";
import { AuthContext } from "../Context/AuthContext";
import ErrorPage from "../Components/ErrorPage";
import "../Styles/AdminOrders.css";

export default function AdminOrdersNew() {
  const [orders, setOrders] = useState([]);
  const [pendingStatus, setPendingStatus] = useState({});
  const [error, setError] = useState(null);

  const { user, setMessage } = useContext(AuthContext); // 🔥

  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.location.href = "/";
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {

        setError({
          code: "Error",
          msg: "No se pudieron cargar los pedidos.",
        });

        setMessage({
          type: "error",
          text: "Error cargando pedidos ❌",
        });
      }
    };

    fetchOrders();
  }, [user]);

  const handleSelectChange = (orderId, status) => {
    setPendingStatus((prev) => ({
      ...prev,
      [orderId]: status,
    }));

    setMessage({
      type: "info",
      text: "Estado seleccionado ✏️",
    });
  };

  const handleConfirmChange = async (orderId) => {
    const newStatus = pendingStatus[orderId];
    if (!newStatus) return;

    // 🔥 feedback antes
    setMessage({
      type: "waiting",
      text: "Actualizando estado...",
    });

    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );

      setPendingStatus((prev) => ({
        ...prev,
        [orderId]: "",
      }));

      // 🔥 éxito
      setMessage({
        type: "success",
        text: `Estado actualizado a "${newStatus}" ✅`,
      });
    } catch (err) {

      setError({
        code: "Error",
        msg: "No se pudo actualizar el estado del pedido.",
      });

      setMessage({
        type: "error",
        text: "Error actualizando estado ❌",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "#ffba08";
      case "en preparación":
        return "#ff5400";
      case "listo para retirar":
        return "#4caf50";
      case "entregado":
        return "#00bcd4";
      case "cancelado":
        return "#f44336";
      default:
        return "#ccc";
    }
  };

  if (error) return <ErrorPage code={error.code} msg={error.msg} />;

  return (
    <div className="admin-orders-new-container">
      <h2 className="admin-orders-new-title">
        Pedidos (Panel Admin)
      </h2>

      {orders.length === 0 ? (
        <p className="admin-orders-new-empty">
          No hay pedidos
        </p>
      ) : (
        <div className="admin-orders-new-grid">
          {orders.map((order) => (
            <div key={order._id} className="admin-order-card">
              <div className="admin-order-header">
                <span>
                  <strong>Pedido ID:</strong> {order._id}
                </span>

                <span>
                  <strong>Usuario:</strong>{" "}
                  {order.user?.name || "Usuario eliminado"}
                </span>

                <span
                  style={{
                    color: getStatusColor(order.status),
                  }}
                >
                  <strong>Status:</strong> {order.status}
                </span>
              </div>

              <div className="admin-order-details">
                <p>
                  <strong>Método de pago:</strong>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <strong>Estado de pago:</strong>{" "}
                  {order.paymentStatus}
                </p>

                <p>
                  <strong>Código de retiro:</strong>{" "}
                  {order.pickupCode}
                </p>

                <p>
                  <strong>Precio total:</strong> $
                  {order.totalPrice}
                </p>

                {order.items && order.items.length > 0 && (
                  <div className="admin-order-items">
                    <strong>Items:</strong>

                    {order.items.map((item, idx) => (
                      <p key={idx}>
                        {item.name} x {item.quantity} ($
                        {item.price})
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-order-actions">
                <select
                  value={pendingStatus[order._id] || ""}
                  onChange={(e) =>
                    handleSelectChange(
                      order._id,
                      e.target.value
                    )
                  }
                  className="admin-order-select"
                >
                  <option value="" disabled>
                    Seleccionar estado
                  </option>

                  <option value="pendiente">
                    Pendiente
                  </option>
                  <option value="en preparación">
                    En preparación
                  </option>
                  <option value="listo para retirar">
                    Listo para retirar
                  </option>
                  <option value="entregado">
                    Entregado
                  </option>
                  <option value="cancelado">
                    Cancelado
                  </option>
                </select>

                {pendingStatus[order._id] && (
                  <button
                    className="btn-admin-order-confirm"
                    onClick={() =>
                      handleConfirmChange(order._id)
                    }
                  >
                    Confirmar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}