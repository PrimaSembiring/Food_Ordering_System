import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data));
  }, []);

  const loadDetail = async (id) => {
    const res = await axios.get(
      `http://localhost:8000/api/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSelected(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pesanan Saya</h1>

      {orders.map((o) => (
        <div key={o.id} style={{ marginBottom: 10 }}>
          <b>Order #{o.id}</b> — Rp {o.total} — {o.status}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => loadDetail(o.id)}
          >
            Detail
          </button>
        </div>
      ))}

      {selected && (
        <>
          <hr />
          <h2>Detail Order #{selected.id}</h2>
          {selected.items.map((i, idx) => (
            <div key={idx}>
              {i.menu_name} — {i.quantity} x Rp {i.price} = Rp{" "}
              {i.subtotal}
            </div>
          ))}
          <p>
            <b>Total: Rp {selected.total}</b>
          </p>
          <p>Status: {selected.status}</p>
          <p>Pembayaran: {selected.payment_status}</p>
        </>
      )}
    </div>
  );
}
