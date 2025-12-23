// src/pages/owner/OwnerOrders.jsx
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
    } catch {
      alert("Gagal mengambil pesanan");
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
    } catch {
      alert("Gagal update order");
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: 20 }}>📦 Pesanan Masuk</h1>

      <div style={grid}>
        {orders.map((order) => (
          <div
            key={order.order_id}
            style={card}
            onClick={() => setSelectedOrder(order)}
          >
            <div style={row}>
              <b>#{order.order_id}</b>
              <span>Rp {order.total}</span>
            </div>

            <div style={badgeRow}>
              <span style={statusBadge(order.status)}>
                {order.status}
              </span>
              <span style={payBadge(order.payment_status)}>
                {order.payment_status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        role="owner"
        onClose={() => setSelectedOrder(null)}
        onAction={handleAction}
      />
    </>
  );
}

/* ================= STYLES ================= */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 16,
};

const card = {
  background: "white",
  padding: 16,
  borderRadius: 12,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "transform 0.15s ease",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12,
};

const badgeRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const statusBadge = (status) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: "bold",
  background:
    status === "CONFIRMED"
      ? "#16a34a"
      : status === "CANCELLED"
      ? "#dc2626"
      : "#2563eb",
  color: "white",
});

const payBadge = (status) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: "bold",
  background:
    status === "PAID"
      ? "#16a34a"
      : status === "WAITING_VERIFICATION"
      ? "#f97316"
      : "#2563eb",
  color: "white",
});
