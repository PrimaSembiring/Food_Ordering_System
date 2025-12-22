import { useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import PaymentModal from "./PaymentModal";

export default function CartModal({ onClose }) {
  const { items, updateQty, total, clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    if (items.length === 0) return;

    try {
      setLoading(true);

      const payload = {
        items: items.map((i) => ({
          menu_item_id: i.id,
          quantity: i.qty,
        })),
      };

      const res = await api.post("/orders", payload);
      setOrderId(res.data.order_id);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Keranjang</h3>

        {items.map((i) => (
          <div key={i.id}>
            {i.name} — Rp {i.price * i.qty}
            <button onClick={() => updateQty(i.id, -1)}>-</button>
            {i.qty}
            <button onClick={() => updateQty(i.id, 1)}>+</button>
          </div>
        ))}

        <b>Total: Rp {total}</b>
        <br /><br />

        {!orderId && (
          <>
            <button onClick={onClose}>Tutup</button>
            <button onClick={checkout} disabled={loading}>
              {loading ? "Memproses..." : "Bayar"}
            </button>
          </>
        )}

        {orderId && (
          <PaymentModal
            orderId={orderId}
            onSuccess={() => {
              clearCart();
              setOrderId(null);
              onClose();
            }}
            onCancel={() => setOrderId(null)}
          />
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 400,
};
