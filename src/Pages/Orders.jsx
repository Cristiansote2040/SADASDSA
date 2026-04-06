import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import ErrorPage from "../Components/ErrorPage"; // 🔹 Importamos ErrorPage
import Loading from "../Components/Loading";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null); // 🔹 Estado para capturar errores
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getMyOrders();
        setOrders(res.data);
      } catch (err) {
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Error al cargar pedidos",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  if (loading) return <Loading />;

  // 🔹 Si hay error, mostramos ErrorPage
  if (error) {
    return <ErrorPage code={error.code} message={error.message} />;
  }

  return (
    <div className="orders-page">
      <h2>Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p>No hay pedidos aún</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p>Pedido: {order._id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalPrice}</p>
            <p>Pago: {order.paymentStatus}</p>
          </div>
        ))
      )}
    </div>
  );
}
