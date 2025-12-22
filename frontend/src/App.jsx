import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= PUBLIC ================= */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* ================= CUSTOMER ================= */
import CustomerLayout from "./pages/CustomerLayout";
import Menu from "./pages/Menu";
import OrderHistory from "./pages/OrderHistory";

/* ================= OWNER ================= */
// (disiapkan, tapi belum aktif)
// import OwnerLayout from "./pages/owner/OwnerLayout";
// import OwnerDashboard from "./pages/owner/OwnerDashboard";
// import OwnerMenu from "./pages/owner/OwnerMenu";
// import OwnerOrders from "./pages/owner/OwnerOrders";

/* ================= AUTH ================= */
import { getToken, getRole } from "./utils/auth";

/* ================= PROTECTED ROUTE ================= */
function CustomerRoute({ children }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "customer") return <Navigate to="/" replace />;

  return children;
}

/*
function OwnerRoute({ children }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "owner") return <Navigate to="/" replace />;

  return children;
}
*/

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= CUSTOMER ================= */}
        <Route
          element={
            <CustomerRoute>
              <CustomerLayout />
            </CustomerRoute>
          }
        >
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Route>

        {/* ================= OWNER (NANTI) ================= */}
        {/*
        <Route
          element={
            <OwnerRoute>
              <OwnerLayout />
            </OwnerRoute>
          }
        >
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/menu" element={<OwnerMenu />} />
          <Route path="/owner/orders" element={<OwnerOrders />} />
        </Route>
        */}

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
