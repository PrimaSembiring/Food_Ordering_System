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