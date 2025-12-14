import React, { useState } from 'react';
import { Store } from 'lucide-react';
import './App.css';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import ManageMenuPage from './pages/ManageMenuPage';
import { initialMenuItems } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [activeView, setActiveView] = useState('menu');
  
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Authentication handlers
  const handleAuth = (authForm, authMode, userRole) => {
    if (authMode === 'register') {
      const newUser = {
        id: Date.now(),
        name: authForm.name,
        email: authForm.email,
        role: userRole
      };
      setCurrentUser(newUser);
    } else {
      const user = {
        id: 1,
        name: authForm.email.split('@')[0],
        email: authForm.email,
        role: userRole
      };
      setCurrentUser(user);
    }
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setActiveView('menu');
  };

  // Cart handlers
  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: Date.now(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      items: [...cart],
      total: getCartTotal(),
      status: 'pending',
      date: new Date().toLocaleString()
    };
    
    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowCart(false);
    setActiveView('orders');
  };

  // Menu handlers
  const handleAddMenu = (menuForm) => {
    const newItem = {
      id: Date.now(),
      ...menuForm,
      price: parseInt(menuForm.price),
      ownerId: currentUser.id
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleUpdateMenu = (item) => {
    setMenuItems(menuItems.map(m => 
      m.id === item.id ? { ...item, price: parseInt(item.price) } : m
    ));
  };

  const handleDeleteMenu = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // Order handlers
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const userOrders = currentUser?.role === 'customer' 
    ? orders.filter(o => o.customerId === currentUser.id)
    : orders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header
        currentUser={currentUser}
        cart={cart}
        onShowAuth={() => setShowAuth(true)}
        onShowCart={() => setShowCart(true)}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <AuthModal
        show={showAuth}
        onClose={() => setShowAuth(false)}
        onAuth={handleAuth}
      />

      <CartModal
        show={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        updateQuantity={updateCartQuantity}
        removeItem={removeFromCart}
        placeOrder={placeOrder}
        getTotal={getCartTotal}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!currentUser ? (
          <div className="text-center py-20">
            <Store className="w-24 h-24 text-orange-300 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to FoodHub</h2>
            <p className="text-xl text-gray-600 mb-8">Please login or register to continue</p>
            <button
              onClick={() => setShowAuth(true)}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition text-lg font-semibold"
            >
              Get Started
            </button>
          </div>
        ) : activeView === 'menu' ? (
          <MenuPage
            menuItems={menuItems}
            onAddToCart={addToCart}
            isCustomer={currentUser.role === 'customer'}
          />
        ) : activeView === 'orders' ? (
          <OrdersPage
            orders={userOrders}
            isOwner={currentUser.role === 'owner'}
            onUpdateStatus={updateOrderStatus}
          />
        ) : activeView === 'manage' && currentUser.role === 'owner' ? (
          <ManageMenuPage
            menuItems={menuItems}
            currentUser={currentUser}
            onAddMenu={handleAddMenu}
            onUpdateMenu={handleUpdateMenu}
            onDeleteMenu={handleDeleteMenu}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;