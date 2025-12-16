// API Service - Mock data and functions
// In production, replace with actual API calls

// Mock initial menu items
export const initialMenuItems = [
  { 
    id: 1, 
    name: 'Nasi Goreng Spesial', 
    category: 'Main Course', 
    price: 25000, 
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 
    ownerId: 1 
  },
  { 
    id: 2, 
    name: 'Mie Ayam Bakso', 
    category: 'Main Course', 
    price: 20000, 
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 
    ownerId: 1 
  },
  { 
    id: 3, 
    name: 'Sate Ayam', 
    category: 'Main Course', 
    price: 30000, 
    image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400', 
    ownerId: 1 
  },
  { 
    id: 4, 
    name: 'Gado-Gado', 
    category: 'Main Course', 
    price: 18000, 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', 
    ownerId: 2 
  },
  { 
    id: 5, 
    name: 'Es Teh Manis', 
    category: 'Drinks', 
    price: 5000, 
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 
    ownerId: 1 
  },
  { 
    id: 6, 
    name: 'Jus Alpukat', 
    category: 'Drinks', 
    price: 15000, 
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', 
    ownerId: 2 
  },
];

export const categories = ['All', 'Main Course', 'Drinks', 'Snacks', 'Desserts'];

// Helper functions
export const formatCurrency = (amount) => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

// Authentication API
export const loginUser = async (email, password, role) => {
  // Mock login - replace with actual API call
  return {
    id: 1,
    name: email.split('@')[0],
    email: email,
    role: role
  };
};

export const registerUser = async (name, email, password, role) => {
  // Mock register - replace with actual API call
  return {
    id: Date.now(),
    name: name,
    email: email,
    role: role
  };
};

// Review API
export const createReview = async (review) => {
  // Mock create review - replace with actual API call
  return {
    id: Date.now(),
    ...review,
    date: new Date().toLocaleString()
  };
};

export const getMenuReviews = async (menuItemId) => {
  // Mock get reviews - replace with actual API call
  return [];
};

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

// Payment methods
export const paymentMethods = [
  {
    id: 'qris',
    name: 'QRIS',
    type: 'qr',
    icon: '📱',
    description: 'Scan QR Code dengan aplikasi e-wallet'
  },
  {
    id: 'dana',
    name: 'DANA',
    type: 'ewallet',
    icon: '💳',
    account: '081234567890',
    accountName: 'FoodHub Restaurant'
  },
  {
    id: 'gopay',
    name: 'GoPay',
    type: 'ewallet',
    icon: '💚',
    account: '081234567890',
    accountName: 'FoodHub Restaurant'
  },
  {
    id: 'ovo',
    name: 'OVO',
    type: 'ewallet',
    icon: '💜',
    account: '081234567890',
    accountName: 'FoodHub Restaurant'
  },
  {
    id: 'bca',
    name: 'Bank BCA',
    type: 'bank',
    icon: '🏦',
    account: '1234567890',
    accountName: 'FoodHub Restaurant'
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    type: 'bank',
    icon: '🏦',
    account: '9876543210',
    accountName: 'FoodHub Restaurant'
  },
  {
    id: 'bri',
    name: 'Bank BRI',
    type: 'bank',
    icon: '🏦',
    account: '5555666677778888',
    accountName: 'FoodHub Restaurant'
  }
];

// Payment status types
export const paymentStatus = {
  WAITING_PAYMENT: 'waiting_payment',
  PAYMENT_UPLOADED: 'payment_uploaded',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  PAYMENT_REJECTED: 'payment_rejected'
};

// Order status with payment
export const orderStatus = {
  WAITING_PAYMENT: 'waiting_payment',
  PAYMENT_UPLOADED: 'payment_uploaded',
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};