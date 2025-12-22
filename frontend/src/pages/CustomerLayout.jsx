import { Outlet } from "react-router-dom";
import { useState } from "react";
import NavbarCustomer from "../components/NavbarCustomer";
import CartModal from "../components/CartModal";

export default function CustomerLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <NavbarCustomer onCartClick={() => setCartOpen(true)} />
      <Outlet />

      {cartOpen && (
        <CartModal onClose={() => setCartOpen(false)} />
      )}
    </>
  );
}
