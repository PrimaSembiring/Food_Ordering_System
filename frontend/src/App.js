import React, { useState } from 'react';
import { Store } from 'lucide-react';
import './App.css';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import ReviewModal from './components/ReviewModal';
import MenuReviewsModal from './components/MenuReviewsModal';
import PaymentModal from './components/PaymentModal';
import PaymentProofModal from './components/PaymentProofModal';
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
  const [reviews, setReviews] = useState([]);
  
  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  
  // Menu Reviews Modal States
  const [showMenuReviewsModal, setShowMenuReviewsModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);

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
    
    setPendingOrder(newOrder);
    setShowCart(false);
    setShowPaymentModal(true);
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

  // Review handlers
  const handleReviewItem = (orderId, item) => {
    console.log('Review item clicked:', orderId, item); // Debug
    setReviewingOrderId(orderId);
    setReviewingItem(item);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      orderId: reviewingOrderId,
      menuItemId: reviewingItem.id,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toLocaleString()
    };
    
    console.log('New review:', newReview); // Debug
    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
    setReviewingItem(null);
    setReviewingOrderId(null);
    
    alert('✅ Review submitted successfully!');
  };

  const handleViewReviews = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setShowMenuReviewsModal(true);
  };

  // Payment handlers
  const handleConfirmPayment = (paymentData) => {
    // Store payment proof
    setPaymentProof(paymentData.proof);
    
    // Create order with payment info
    const orderWithPayment = {
      ...pendingOrder,
      status: 'pending',
      paymentMethod: paymentData.method,
      paymentMethodId: paymentData.methodId,
      paymentProof: paymentData.proof,
      paymentDate: new Date().toLocaleString()
    };
    
    // Add order to list
    setOrders([orderWithPayment, ...orders]);
    setCart([]);
    
    // Show payment proof
    setShowPaymentModal(false);
    setShowPaymentProofModal(true);
    
    // Close modals and navigate after a delay
    setTimeout(() => {
      setShowPaymentProofModal(false);
      setActiveView('orders');
      setPendingOrder(null);
      alert('✅ Payment berhasil! Pesanan Anda sedang diproses.');
    }, 3000);
  };

  const handleViewPaymentProof = (proof) => {
    setPaymentProof(proof);
    setShowPaymentProofModal(true);
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
        onProceedToPayment={placeOrder}
        getTotal={getCartTotal}
      />

      <ReviewModal
        show={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setReviewingItem(null);
          setReviewingOrderId(null);
        }}
        orderItem={reviewingItem}
        onSubmitReview={handleSubmitReview}
      />

      <MenuReviewsModal
        show={showMenuReviewsModal}
        onClose={() => {
          setShowMenuReviewsModal(false);
          setSelectedMenuItem(null);
        }}
        menuItem={selectedMenuItem}
        reviews={selectedMenuItem ? reviews.filter(r => r.menuItemId === selectedMenuItem.id) : []}
      />

      <PaymentModal
        show={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingOrder(null);
        }}
        cartTotal={pendingOrder?.total || 0}
        onConfirmPayment={handleConfirmPayment}
      />

      <PaymentProofModal
        show={showPaymentProofModal}
        onClose={() => setShowPaymentProofModal(false)}
        proofImage={paymentProof}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
    
        {/* 1. HEADER GOFOOD: Tampil HANYA JIKA BELUM LOGIN (!currentUser) */}
        {!currentUser && (
          <div className="text-white py-20 md:py-24 relative overflow-hidden mb-12">
              <img
                  src={foodbackground} 
                  alt="Latar Belakang Makanan"
                  // Menambahkan opacity untuk membuat gambar samar
                  className="absolute inset-0 w-full h-full object-cover rounded-xl" 
              />

              <div className="max-w-4xl mx-auto text-center relative z-10">
                  <Store className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Makan enak? FoodHub-in aja.</h2>
                  <p className="text-xl md:text-2xl font-light mb-8">
                      Pesan yang bikin perut nyaman langsung di sini, semudah di aplikasi.
                  </p>

            
                 
              </div>
          </div>
        )}

        {/* 2. LOGIKA ROUTING UTAMA */}

        {/* Tampilkan Manage Page HANYA jika owner sudah login dan activeView='manage' */}
        {currentUser && activeView === 'manage' && currentUser.role === 'owner' ? (
          <ManageMenuPage
            menuItems={menuItems}
            currentUser={currentUser}
            onAddMenu={handleAddMenu}
            onUpdateMenu={handleUpdateMenu}
            onDeleteMenu={handleDeleteMenu}
          />
        ) : 
        /* Tampilkan Orders Page HANYA jika sudah login dan activeView='orders' */
        currentUser && activeView === 'orders' ? (
          <OrdersPage
            orders={userOrders}
            isOwner={currentUser.role === 'owner'}
            onUpdateStatus={updateOrderStatus}
            onReviewItem={handleReviewItem}
            onViewPaymentProof={handleViewPaymentProof}
            reviews={reviews}
          />
        ) : (
          /* KONDISI DEFAULT: TAMPILKAN MENU PAGE (untuk semua orang, baik login maupun belum) */
          <MenuPage
            menuItems={menuItems}
            onAddToCart={addToCart}
            isCustomer={currentUser?.role === 'customer'}
            reviews={reviews}
            onViewReviews={handleViewReviews}
          />
        )}
      </main>
    </div>
  );
}

export default App;