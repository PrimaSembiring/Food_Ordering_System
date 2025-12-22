import api from "../utils/api";

export default function PaymentModal({ orderId, onSuccess, onCancel }) {
  const pay = async (method) => {
    try {
      await api.post(`/orders/${orderId}/status`, {
        payment_method: method,
      });

      alert("Pembayaran berhasil ✅");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Pembayaran gagal ❌, silakan coba lagi");
    }
  };

  return (
    <div style={modal}>
      <h4>Pilih Metode Pembayaran</h4>

      <button onClick={() => pay("CASH")}>Cash</button>
      <button onClick={() => pay("DANA")}>DANA</button>
      <button onClick={() => pay("BRI")}>BRI</button>

      <br /><br />
      <button onClick={onCancel}>Batal</button>
    </div>
  );
}

const modal = {
  marginTop: 20,
  padding: 10,
  borderTop: "1px solid #ccc",
};
