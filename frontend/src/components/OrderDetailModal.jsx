import React from "react";

export default function OrderDetailModal({
  order,
  onClose,
  isOwner = false,
  onApprove,
  onReject,
}) {
  if (!order) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* HEADER */}
        <div style={{ marginBottom: 20 }}>
          <h2>Order #{order.order_id || order.id}</h2>

          {order.customer?.email && (
            <p>
              <b>Customer:</b> {order.customer.email}
            </p>
          )}

          <p>
            <b>Status:</b>{" "}
            <span style={statusStyle(order.status)}>
              {order.status}
            </span>
          </p>

          <p>
            <b>Pembayaran:</b>{" "}
            <span style={paymentStyle(order.payment_status)}>
              {order.payment_status}
            </span>
          </p>
        </div>

        {/* ITEMS */}
        <div style={{ marginBottom: 20 }}>
          <h3>Daftar Pesanan</h3>

          {!order.items || order.items.length === 0 ? (
            <p>Tidak ada item</p>
          ) : (
            order.items.map((item, idx) => (
              <div key={idx} style={itemStyle}>
                <span>
                  {item.menu_name} x {item.quantity}
                </span>
                <span>Rp {item.subtotal}</span>
              </div>
            ))
          )}
        </div>

        {/* TOTAL */}
        <h3>Total: Rp {order.total}</h3>

        {/* OWNER ACTION */}
        {isOwner && order.payment_status === "WAITING_VERIFICATION" && (
          <div style={{ marginTop: 20 }}>
            <button
              style={approveBtn}
              onClick={() => onApprove(order.order_id || order.id)}
            >
              Proses
            </button>

            <button
              style={rejectBtn}
              onClick={() => onReject(order.order_id || order.id)}
            >
              Tolak
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: 30, textAlign: "right" }}>
          <button onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#1e1e1e",
  padding: 30,
  width: "90%",
  maxWidth: 500,
  borderRadius: 12,
  color: "white",
};

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #333",
};

const approveBtn = {
  marginRight: 10,
  padding: "8px 16px",
  background: "#22c55e",
  color: "black",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const rejectBtn = {
  padding: "8px 16px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const statusStyle = (status) => ({
  color:
    status === "CONFIRMED"
      ? "lime"
      : status === "CANCELLED"
      ? "red"
      : "orange",
});

const paymentStyle = (status) => ({
  color:
    status === "PAID"
      ? "lime"
      : status === "REJECTED"
      ? "red"
      : "orange",
});
