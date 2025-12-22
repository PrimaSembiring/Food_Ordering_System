import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function NavbarCustomer({ onCartClick }) {
  const navigate = useNavigate();
  const { items } = useCart();

  return (
    <header style={{ padding: 16 }}>
      <b>🍔 FoodHub</b>

      <button onClick={() => navigate("/menu")}>Menu</button>
      <button onClick={() => navigate("/orders")}>Pesanan Saya</button>

      <button onClick={onCartClick}>
        🛒 Keranjang ({items.length})
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </header>
  );
}
