import api from "./api";

export const createOrder = async (items) => {
  const res = await api.post("/orders", {
    items: items.map((i) => ({
      menu_item_id: i.id,
      quantity: i.quantity,
    })),
  });
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const submitPayment = async (orderId, payload) => {
  const res = await api.post(`/orders/${orderId}/payment`, payload);
  return res.data;
};

/* ✅ OWNER VERIFY PAYMENT */
export const verifyPayment = async (orderId, action) => {
  const res = await api.post(`/orders/${orderId}/verify-payment`, {
    action, // "accept" | "reject"
  });
  return res.data;
};
