// src/utils/auth.js

export const setAuth = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
