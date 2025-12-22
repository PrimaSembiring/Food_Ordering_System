import { Outlet, useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { clearAuth, getRole, getToken } from "../utils/auth";
import { useEffect, useState } from "react";

export default function CustomerLayout() {
  const navigate = useNavigate();
  const token = getToken();
  const role = getRole();

  // 🔐 AUTH GUARD
  if (!token || role !== "customer") {
    return <Navigate to="/login" replace />;
  }

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("cart");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Navbar
        role="customer"
        cartCount={cart.length}
        onMenuClick={() => navigate("/menu")}
        onOrdersClick={() => navigate("/orders")}
        onCartClick={() => navigate("/menu#cart")}
        onLogout={handleLogout}
      />

      {/* CONTENT */}
      <main
        style={{
          flex: 1,
          background: "#1a1a1a",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <Outlet context={{ cart, setCart }} />
      </main>
    </div>
  );
}
