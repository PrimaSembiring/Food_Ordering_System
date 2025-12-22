import { useEffect, useState } from "react";
import api from "../utils/api";
import { useCart } from "../context/CartContext";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/menu").then((res) => setMenus(res.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Menu</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {menus.map((menu) => (
          <div key={menu.id} style={card}>
            <img
              src={menu.image_url || "https://via.placeholder.com/300"}
              alt={menu.name}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <h3 style={{ marginTop: 12 }}>{menu.name}</h3>
            <p style={{ color: "#555" }}>Rp {menu.price}</p>

            <button
              style={btn}
              onClick={() => addToCart(menu)}
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 16,
  background: "white",
};

const btn = {
  marginTop: 12,
  width: "100%",
  padding: "10px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "#16a34a",
  color: "white",
  fontWeight: "bold",
};
