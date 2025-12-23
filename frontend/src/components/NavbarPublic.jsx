import { isLoggedIn, clearAuth } from "../utils/auth";

export default function NavbarPublic({ onLogin }) {
  const auth = isLoggedIn();

  return (
    <nav style={nav}>
      <span style={{ fontWeight: "bold" }}>🍔 FoodHub</span>

      {auth ? (
        <button
          onClick={() => {
            clearAuth();
            window.location.reload();
          }}
          style={btn}
        >
          Logout
        </button>
      ) : (
        <button onClick={onLogin} style={btnPrimary}>
          Login / Register
        </button>
      )}
    </nav>
  );
}

const nav = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  background: "white",
  zIndex: 50,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const btn = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};

const btnPrimary = {
  ...btn,
  background: "#f97316",
  color: "white",
  fontWeight: "bold",
};
