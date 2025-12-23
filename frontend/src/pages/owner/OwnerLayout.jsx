// src/pages/owner/OwnerLayout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function OwnerLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={layout}>
      {/* SIDEBAR */}
      <aside style={sidebar}>
        <h2 style={title}>🍔 Owner Panel</h2>

        <nav style={nav}>
          <Link to="/owner/orders" style={navItem}>
            📦 Pesanan
          </Link>
          <Link to="/owner/menu" style={navItem}>
            🍽️ Menu
          </Link>
        </nav>

        <button style={logoutBtn} onClick={logout}>
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main style={content}>
        <Outlet />
      </main>
    </div>
  );
}

/* ================= STYLES ================= */

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#f4f6f8",
};

const sidebar = {
  width: 240,
  background: "linear-gradient(180deg, #020617, #0f172a)",
  color: "white",
  padding: 20,
  display: "flex",
  flexDirection: "column",
};

const title = {
  marginBottom: 30,
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const navItem = {
  color: "white",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.08)",
};

const logoutBtn = {
  marginTop: "auto",
  padding: 10,
  borderRadius: 8,
  background: "#dc2626",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const content = {
  flex: 1,
  padding: 32,
  overflowY: "auto",
};
