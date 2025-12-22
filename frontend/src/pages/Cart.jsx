export default function Cart({ open, onClose }) {
  if (!open) return null;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  return (
    <div style={{
      width: "320px",
      background: "#111",
      color: "#fff",
      padding: "16px",
      position: "relative"
    }}>
      <button onClick={onClose}>❌</button>

      <h3>Keranjang</h3>

      {cart.length === 0 && <p>Keranjang kosong</p>}

      {cart.map(item => (
        <div key={item.id} style={{ marginBottom: "12px" }}>
          <strong>{item.name}</strong>
          <div>{item.quantity} x Rp {item.price}</div>
        </div>
      ))}

      <button
        style={{ marginTop: "16px", width: "100%" }}
        onClick={() => alert("lanjut payment")}
      >
        Checkout
      </button>
    </div>
  );
}
