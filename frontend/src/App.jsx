import { BrowserRouter, Routes, Route } from "react-router-dom";

/* PUBLIC */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* CUSTOMER */
import CustomerLayout from "./pages/CustomerLayout";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import OrderHistory from "./pages/OrderHistory";
import Cart from "./pages/Cart";

/* OWNER (kalau ada) */
// import OwnerLayout from "./pages/owner/OwnerLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CUSTOMER */}
        <Route element={<CustomerLayout />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/history" element={<OrderHistory />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
