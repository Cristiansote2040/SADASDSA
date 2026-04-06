export default function OrderItem({ order }) {
  return (
    <div className="order-item">
      <h4>Pedido: {order._id}</h4>
      <p>Estado: {order.status}</p>
      <p>Total: ${order.totalPrice}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item._id}>
            {item.name} x {item.quantity} (${item.price})
          </li>
        ))}
      </ul>
    </div>
  );
}