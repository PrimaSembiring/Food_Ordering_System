import { Link, Outlet, useNavigate } from "react-router-dom";

export default function OwnerLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 220, background: "#111", padding: 20 }}>
        <h3>Owner Panel</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/owner/orders">📦 Pesanan</Link>
          <Link to="/owner/menu">🍽️ Menu</Link>
          <button onClick={logout} style={{ marginTop: 20 }}>
            Logout
          </button>
        </nav>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: 30 }}>
        <Outlet />
      </main>
    </div>
  );
}
