import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/menu")
      .then((res) => setMenus(res.data));
  }, []);

  const addToCart = (menu) => {
    const existing = cart.find((c) => c.id === menu.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === menu.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart(cart.filter((c) => c.id !== id));
    } else {
      setCart(cart.map((c) => (c.id === id ? { ...c, quantity: qty } : c)));
    }
  };

  const checkout = async () => {
    if (cart.length === 0) return alert("Keranjang kosong");

    const items = cart.map((c) => ({
      menu_item_id: c.id,
      quantity: c.quantity,
    }));

    try {
      await axios.post(
        "http://localhost:8000/api/orders",
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order berhasil dibuat");
      setCart([]);
      navigate("/orders");
    } catch (err) {
      alert("Gagal checkout");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Menu</h1>

      <button onClick={() => navigate("/orders")}>
        Pesanan Saya
      </button>

      <hr />

      {menus.map((m) => (
        <div key={m.id} style={{ marginBottom: 10 }}>
          <b>{m.name}</b> - Rp {m.price}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => addToCart(m)}
          >
            + Keranjang
          </button>
        </div>
      ))}

      <hr />
      <h2>Keranjang</h2>

      {cart.length === 0 && <p>Kosong</p>}

      {cart.map((c) => (
        <div key={c.id}>
          {c.name} — {c.quantity} x Rp {c.price}
          <button onClick={() => updateQty(c.id, c.quantity + 1)}>+</button>
          <button onClick={() => updateQty(c.id, c.quantity - 1)}>-</button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <p>
            <b>
              Total: Rp{" "}
              {cart.reduce((s, c) => s + c.price * c.quantity, 0)}
            </b>
          </p>
          <button onClick={checkout}>Checkout</button>
        </>
      )}
    </div>
  );
}
