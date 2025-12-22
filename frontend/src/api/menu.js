import api from "./axios";

export const getMenus = () => {
  return api.get("/menu");
};

export const createMenu = (data) => {
  return api.post("/menu", data);
};

export const updateMenu = (id, data) => {
  return api.put(`/menu/${id}`, data);
};

export const deleteMenu = (id) => {
  return api.delete(`/menu/${id}`);
};
