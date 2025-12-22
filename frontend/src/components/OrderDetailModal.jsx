import { useEffect, useState } from "react";
import api from "../utils/api";

export default function OrderDetailModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [orderId]);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal ambil detail order");
    }
  };

  if (!order) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Order #{order.id}</h2>

        <p>Status: {order.status}</p>
        <p>Pembayaran: {order.payment_status}</p>

        <hr />

        {order.items.length === 0 && <p>Tidak ada item</p>}

        {order.items.map((item, idx) => (
          <p key={idx}>
            {item.menu_name} x {item.quantity} = Rp {item.subtotal}
          </p>
        ))}

        <hr />

        <strong>Total: Rp {order.total}</strong>

        <br />
        <br />

        <button onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
};

const modal = {
  background: "#fff",
  padding: 20,
  maxWidth: 400,
  margin: "100px auto",
  borderRadius: 8,
};
