import { useEffect, useState } from "react";
import api from "../../utils/api";
import OrderDetailModal from "../../components/OrderDetailModal";

export default function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (orderId, action) => {
    try {
      await api.post(`/admin/orders/${orderId}/verify`, { action });
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert("Gagal memproses order");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pesanan Masuk</h1>

      {orders.map((order) => (
        <div
          key={order.order_id}
          onClick={() => setSelectedOrder(order)}
          style={{
            border: "1px solid #444",
            padding: 20,
            marginBottom: 15,
            cursor: "pointer",
            borderRadius: 8,
          }}
        >
          <h3>Order #{order.order_id}</h3>
          <p>Customer: {order.customer.email}</p>
          <p>Total: Rp {order.total}</p>
          <p>Status: <b>{order.status}</b></p>
          <p>Pembayaran: <b>{order.payment_status}</b></p>
        </div>
      ))}

      {/* MODAL DETAIL */}
      <OrderDetailModal
        order={selectedOrder}
        role="owner"
        onClose={() => setSelectedOrder(null)}
        onAction={handleAction}
      />
    </div>
  );
}
