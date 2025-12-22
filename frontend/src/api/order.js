import api from "./axios";

export const createOrder = (items) => {
  return api.post("/orders", {
    items: items.map((item) => ({
      menu_item_id: item.id,
      quantity: item.qty,
    })),
  });
};
