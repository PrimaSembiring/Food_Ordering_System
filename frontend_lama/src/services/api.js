import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   UTILITIES (DULU MOCK)
========================= */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const calculateAverageRating = (reviews = []) => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / reviews.length;
};

export const categories = [
  "Main Course",
  "Snack",
  "Drink",
  "Dessert",
];

export const paymentMethods = [
  {
    id: 1,
    name: "BCA",
    type: "bank",
    account: "1234567890",
    accountName: "FoodFlow",
    icon: "🏦",
  },
  {
    id: 2,
    name: "BRI",
    type: "bank",
    account: "0987654321",
    accountName: "FoodFlow",
    icon: "🏦",
  },
  {
    id: 3,
    name: "OVO",
    type: "ewallet",
    account: "081234567890",
    accountName: "FoodFlow",
    icon: "📱",
  },
];

/* =========================
   DEFAULT EXPORT
========================= */
export default api;
