// src/components/OrderDetailModal.jsx
export default function OrderDetailModal({
  order,
  role,
  onClose,
  onAction,
}) {
  if (!order) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2>Order #{order.order_id}</h2>

        <p>Status: <b>{order.status}</b></p>
        <p>Pembayaran: <b>{order.payment_status}</b></p>

        <hr />

        {order.items?.map((item) => (
          <p key={item.id}>
            {item.menu_name} × {item.quantity} = Rp {item.subtotal}
          </p>
        ))}

        <hr />
        <strong>Total: Rp {order.total}</strong>

        {role === "owner" &&
          order.payment_status === "WAITING_VERIFICATION" && (
            <div style={{ marginTop: 20 }}>
              <button
                style={approve}
                onClick={() => onAction(order.order_id, "approve")}
              >
                Approve
              </button>
              <button
                style={reject}
                onClick={() => onAction(order.order_id, "reject")}
              >
                Reject
              </button>
            </div>
          )}

        <br />
        <button onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal = {
  background: "white",
  padding: 24,
  width: 420,
  borderRadius: 12,
};

const approve = {
  padding: "8px 14px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: 6,
  marginRight: 8,
  cursor: "pointer",
};

const reject = {
  padding: "8px 14px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
