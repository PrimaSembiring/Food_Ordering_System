import React, { useState } from 'react';
import { Store } from 'lucide-react';
import './App.css';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import MenuPage from './pages/MenuPage';
import foodbackground from './Assets/Backgroundmakanan.jpeg';
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
          <div className="bg-white min-h-[80vh]">
            <div className="text-white py-16 md:py-24 relative overflow-hidden">
                <img
                  src={foodbackground} alt="Latar Belakang Makanan" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="max-w-4xl mx-auto text-center relative z-10">   
                    <Store className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />           
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Makan enak? FoodHub-in aja.</h2>
                    <p className="text-xl md:text-2xl font-light mb-8">
                        Pesan yang bikin perut nyaman langsung di sini, semudah di aplikasi.
                    </p>

                    {/* Kotak Pencarian/Lokasi Putih di tengah */}
                    <div className="bg-white p-4 rounded-xl shadow-2xl inline-block -mb-16 transform translate-y-1/2">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Ketik Makananmu"
                                className="px-3 py-2 text-lg text-gray-800 focus:outline-none w-64"
                            />
                            <button 
                                // Tombol ini bisa disetel untuk membuka AuthModal agar user login sebelum eksplor
                                onClick={() => setShowAuth(true)}
                                className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                            >
                                Eksplor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bagian di bawah (Setelah Kotak Pencarian) */}
            <div className="pt-24 pb-12 text-center">
                <h3 className="text-2xl font-bold text-gray-700">Apa aja nih yang enak di FoodHub?</h3>
                <p className="text-gray-500 mt-2">Yuk cari menu makanan yang kamu suka.</p>
            </div>
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