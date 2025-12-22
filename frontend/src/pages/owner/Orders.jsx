import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrderDetailModal from "../components/OrderDetailModal";

export default function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "owner") {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data pesanan");
    }
  };

  const verifyPayment = async (orderId, action) => {
    try {
      await axios.post(
        `http://localhost:8000/api/admin/orders/${orderId}/verify`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders(); // refresh
    } catch (err) {
      alert("Gagal memproses pembayaran");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Owner</h1>

      <button onClick={() => {
        localStorage.clear();
        navigate("/login");
      }}>
        Logout
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.length === 0 && <p>Belum ada pesanan</p>}

      {orders.map((order) => (
        <div
          key={order.order_id}
          style={{
            border: "1px solid #444",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>Order #{order.order_id}</h3>
          <p><b>Email:</b> {order.customer.email}</p>
          <p><b>Total:</b> Rp {order.total}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Pembayaran:</b> {order.payment_status}</p>

          <h4>Item:</h4>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.menu_name} x {item.quantity}  
                (Rp {item.subtotal})
              </li>
            ))}
          </ul>

          {order.payment_status === "WAITING_VERIFICATION" && (
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => verifyPayment(order.order_id, "approve")}
                style={{ marginRight: "10px" }}
              >
                Approve
              </button>
              <button
                onClick={() => verifyPayment(order.order_id, "reject")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
