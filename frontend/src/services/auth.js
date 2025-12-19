import api from "./api";

export const login = async (email, password) => {
  const res = await api.post("/login", { email, password });
  return res.data;
};

export const register = async (name, email, password, role) => {
  const res = await api.post("/register", {
    name,
    email,
    password,
    role,
  });
  return res.data;
};
