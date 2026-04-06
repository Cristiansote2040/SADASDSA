import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage";
import '../Styles/PagoExitoso.css'
export default function PagoExitoso() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const externalReference = searchParams.get("external_reference");
    const orderId = searchParams.get("orderId");

    const fetchOrder = async () => {
      try {
        let res;
        if (externalReference) res = await api.get(`/orders/reference/${externalReference}`);
        else if (orderId) res = await api.get(`/orders/id/${orderId}`);
        else throw { status: 400, message: "No se proporcionó referencia u ID de la orden" };
        setOrder(res.data);
      } catch (err) {
        setError({
          code: err.response?.status || err.status || 500,
          message: err.response?.data?.message || err.message || "Error al cargar la orden",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [searchParams]);

  if (loading) return <div className="success-page-container"><Loading text="Cargando orden..." /></div>;
  if (error) return <ErrorPage code={error.code} message={error.message} />;
  if (!order) return <p>No se encontró la orden.</p>;

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal - order.totalPrice;

  return (
    <div className="success-page-container">
      <div className="success-card">
        <h2 className="success-title">🎉 ¡Pago exitoso!</h2>
        <p className="success-message">¡Gracias por tu compra! Aquí está el detalle:</p>

        <ul className="success-items">
          {order.items.map((item) => (
            <li key={item._id} className="success-item">
              <span className="success-item-name">{item.name} x {item.quantity}</span>
              <span className="success-item-price">${item.price * item.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="success-totals">
          <p>Subtotal: <span>${subtotal}</span></p>
          {discount > 0 && <p>Descuento: <span>-${discount}</span></p>}
          <p className="success-total">Total pagado: <span>${order.totalPrice}</span></p>
        </div>

        {order.status === "listo para retirar" && order.pickupCode ? (
          <div className="success-pickup">
            Código de retiro: <strong>{order.pickupCode}</strong>
          </div>
        ) : (
          <p className="success-prep">
            Tu pedido está en preparación. Recibirás un email cuando esté listo para retirar.
          </p>
        )}
      </div>
    </div>
  );
}