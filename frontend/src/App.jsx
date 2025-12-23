import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= PUBLIC ================= */
import Landing from "./pages/Landing";

/* ================= CUSTOMER ================= */
import CustomerLayout from "./pages/CustomerLayout";
import Menu from "./pages/Menu";
import OrderHistory from "./pages/OrderHistory";

/* ================= OWNER ================= */
import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerOrders from "./pages/owner/OwnerOrders";
import OwnerMenu from "./pages/owner/OwnerMenu";

/* ================= AUTH ================= */
import { getToken, getRole } from "./utils/auth";

/* ================= ROUTE GUARDS ================= */
function CustomerRoute({ children }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/" replace />;
  if (role !== "customer") return <Navigate to="/" replace />;

  return children;
}

function OwnerRoute({ children }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/" replace />;
  if (role !== "owner") return <Navigate to="/" replace />;

  return children;
}

/* ================= APP ================= */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= LANDING ================= */}
        <Route path="/" element={<Landing />} />

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

        {/* ================= OWNER ================= */}
        <Route
          element={
            <OwnerRoute>
              <OwnerLayout />
            </OwnerRoute>
          }
        >
          <Route path="/owner/orders" element={<OwnerOrders />} />
          <Route path="/owner/menu" element={<OwnerMenu />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
