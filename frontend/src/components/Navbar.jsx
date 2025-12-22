export default function Navbar({
  role,
  cartCount = 0,
  onMenuClick,
  onOrdersClick,
  onCartClick,
  onLogout,
}) {
  if (role !== "customer") return null;

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#000",
        borderRight: "1px solid #333",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        🍔 FoodHub
      </div>

      {/* BUTTONS */}
      <button style={btn} onClick={onMenuClick}>
        Menu
      </button>

      <button style={btn} onClick={onOrdersClick}>
        Pesanan Saya
      </button>

      <button style={btn} onClick={onCartClick}>
        Keranjang{" "}
        {cartCount > 0 && (
          <span style={badge}>{cartCount}</span>
        )}
      </button>

      <button
        style={{ ...btn, marginTop: "auto", background: "#7f1d1d" }}
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
}

/* STYLES */
const btn = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  background: "#111",
  color: "white",
  border: "1px solid #333",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",
};

const badge = {
  float: "right",
  background: "red",
  color: "white",
  borderRadius: "12px",
  padding: "2px 8px",
  fontSize: "12px",
};
