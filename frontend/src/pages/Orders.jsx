import { useEffect, useState } from "react";
import api from "../utils/api";
import OrderDetailModal from "../components/OrderDetailModal";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Pesanan Saya</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => setSelectedOrder(order)}
          style={{
            border: "1px solid #444",
            padding: 20,
            marginBottom: 15,
            cursor: "pointer",
            borderRadius: 8,
          }}
        >
          <h3>Order #{order.id}</h3>
          <p>Total: Rp {order.total}</p>
          <p>Status: <b>{order.status}</b></p>
          <p>Pembayaran: <b>{order.payment_status}</b></p>
        </div>
      ))}

      {/* MODAL DETAIL */}
      <OrderDetailModal
        order={selectedOrder}
        role="customer"
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
