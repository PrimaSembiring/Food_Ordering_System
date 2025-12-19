import api from "./api";

// GET semua menu
export const getMenus = async () => {
  const res = await api.get("/menu");
  return res.data;
};

// OWNER: tambah menu
export const createMenu = async (menu) => {
  const res = await api.post("/menu", menu);
  return res.data;
};

// OWNER: update menu
export const updateMenu = async (id, data) => {
  const res = await api.put(`/menu/${id}`, data);
  return res.data;
};

// OWNER: delete menu (soft delete)
export const deleteMenu = async (id) => {
  const res = await api.delete(`/menu/${id}`);
  return res.data;
};
