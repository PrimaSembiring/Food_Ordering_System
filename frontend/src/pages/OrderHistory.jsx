import { useEffect, useState } from "react";
import api from "../utils/api";
import OrderDetailModal from "../components/OrderDetailModal";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Gagal ambil orders", err);
      alert("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Pesanan Saya</h1>

      {orders.length === 0 && <p>Belum ada pesanan</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            borderBottom: "1px solid #ccc",
            padding: "10px 0",
          }}
        >
          <strong>Order #{order.id}</strong> — Rp {order.total} —{" "}
          {order.payment_status}

          <button
            style={{ marginLeft: 10 }}
            onClick={() => setSelectedOrderId(order.id)}
          >
            Detail
          </button>
        </div>
      ))}

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
