import React, { useState, useEffect } from "react";
import "./App.css";

/* =======================
   COMPONENTS
======================= */
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import CartModal from "./components/CartModal";
import PaymentModal from "./components/PaymentModal";
import ReviewModal from "./components/ReviewModal";
import MenuReviewsModal from "./components/MenuReviewsModal";
import PaymentProofModal from "./components/PaymentProofModal";
import { verifyPayment } from "./services/order";

/* =======================
   PAGES
======================= */
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import ManageMenuPage from "./pages/ManageMenuPage";

/* =======================
   SERVICES
======================= */
import { getMenus, createMenu, updateMenu, deleteMenu } from "./services/menu";
import { createOrder, getOrders, submitPayment } from "./services/order";

/* =======================
   APP
======================= */
function App() {
  /* ===== GLOBAL STATE ===== */
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState("menu");

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  /* ===== MODALS ===== */
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  /* ===== PAYMENT ===== */
  const [pendingOrder, setPendingOrder] = useState(null);
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ===== REVIEW ===== */
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showMenuReviews, setShowMenuReviews] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  /* =======================
     FETCH MENU
  ======================= */
  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getMenus();
      setMenuItems(
        data.map((item) => ({
          ...item,
          image: item.image || item.image_url,
        }))
      );
    };
    fetchMenu();
  }, []);

  /* =======================
     FETCH ORDERS
  ======================= */
  const normalizeOrders = (data) =>
    data.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        name: i.menu_name,
        quantity: i.quantity,
        price: i.price,
      })),
    }));

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(normalizeOrders(data));
  };

  useEffect(() => {
    if (activeView === "orders") fetchOrders();
  }, [activeView]);

  /* =======================
     AUTH
  ======================= */
  const handleAuthSuccess = (data) => {
    localStorage.setItem("token", data.token);
    setCurrentUser({
      id: data.user.user_id,
      email: data.user.email,
      role: data.user.role,
    });
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setCart([]);
    setActiveView("menu");
  };

  /* =======================
     CART
  ======================= */
  const addToCart = (item) => {
    const found = cart.find((c) => c.id === item.id);
    if (found) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id, change) => {
    setCart(
      cart
        .map((c) =>
          c.id === id ? { ...c, quantity: c.quantity + change } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const getCartTotal = () =>
    cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* =======================
     ORDER → PAYMENT
  ======================= */
  const handlePlaceOrder = async () => {
    try {
      const res = await createOrder(cart);
      setCart([]);

      setPendingOrder({
        id: res.order_id,
        total: res.total,
      });

      setShowPaymentModal(true);
    } catch {
      alert("Gagal membuat order");
    }
  };

  const handleConfirmPayment = async (orderId, data) => {
    try {
      await submitPayment(orderId, {
        payment_method: data.method,
        payment_proof: "bukti_transfer.jpg",
      });

      setShowPaymentModal(false);
      setPendingOrder(null);

      await fetchOrders();
      setActiveView("orders");
    } catch {
      alert("Gagal submit payment");
    }
  };

  /* =======================
     REVIEW HANDLER
  ======================= */
  const openReviewModal = (menu) => {
    setSelectedMenu(menu);
    setShowReviewModal(true);
  };

/* HANDLER */
  const openPaymentProof = (order) => {
    setSelectedOrder(order);
    setShowPaymentProof(true);
  };

  const handleVerifyPayment = async (orderId, action) => {
    await verifyPayment(orderId, action);
    setShowPaymentProof(false);
    setSelectedOrder(null);
  await fetchOrders();
  };

  const openMenuReviews = (menu) => {
    setSelectedMenu(menu);
    setShowMenuReviews(true);
  };

  /* =======================
     MENU OWNER
  ======================= */
  const handleAddMenu = async (form) => {
    await createMenu(form);
    setMenuItems(await getMenus());
  };

  const handleUpdateMenu = async (item) => {
    await updateMenu(item.id, item);
    setMenuItems(await getMenus());
  };

  const handleDeleteMenu = async (id) => {
    await deleteMenu(id);
    setMenuItems(menuItems.filter((m) => m.id !== id));
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <>
      <Header
        currentUser={currentUser}
        cart={cart}
        onShowAuth={() => setShowAuth(true)}
        onShowCart={() => setShowCart(true)}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* AUTH */}
      <AuthModal
        show={showAuth}
        onClose={() => setShowAuth(false)}
        onAuth={handleAuthSuccess}
      />

      {/* CART */}
      <CartModal
        show={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        updateQuantity={updateCartQuantity}
        removeItem={removeFromCart}
        onProceedToPayment={handlePlaceOrder}
        getTotal={getCartTotal}
      />

      {/* PAYMENT */}
      <PaymentModal
        show={showPaymentModal}
        orderId={pendingOrder?.id}
        cartTotal={pendingOrder?.total || 0}
        onConfirmPayment={handleConfirmPayment}
        onClose={() => setShowPaymentModal(false)}
      />

      {/* REVIEW MODALS */}
      <ReviewModal
        show={showReviewModal}
        menuItem={selectedMenu}
        onClose={() => setShowReviewModal(false)}
        onReviewSuccess={() => {}}
      />

      <MenuReviewsModal
        show={showMenuReviews}
        menuItem={selectedMenu}
        onClose={() => setShowMenuReviews(false)}
      />

      <OrdersPage
        orders={orders}
        isOwner={currentUser.role === "owner"}
        onViewPayment={openPaymentProof}
        onReviewItem={(order) => openReviewModal(order.items[0])}
      />

      <PaymentProofModal
        show={showPaymentProof}
        order={selectedOrder}
        onClose={() => setShowPaymentProof(false)}
        onVerify={handleVerifyPayment}
      />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!currentUser ? (
          <MenuPage
            menuItems={menuItems}
            onAddToCart={addToCart}
            onViewReviews={openMenuReviews}
          />
        ) : activeView === "menu" ? (
          <MenuPage
            menuItems={menuItems}
            onAddToCart={addToCart}
            isCustomer={currentUser.role === "customer"}
            onViewReviews={openMenuReviews}
            onReviewItem={openReviewModal}
          />
        ) : activeView === "orders" ? (
          <OrdersPage
            orders={orders}
            isOwner={currentUser.role === "owner"}
            onReviewItem={openReviewModal}
          />
        ) : (
          <ManageMenuPage
            menuItems={menuItems}
            onAddMenu={handleAddMenu}
            onUpdateMenu={handleUpdateMenu}
            onDeleteMenu={handleDeleteMenu}
          />
        )}
      </main>
    </>
  );
}

export default App;
