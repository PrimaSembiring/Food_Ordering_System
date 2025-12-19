import React from "react";
import OrderCard from "../components/OrderCard";

const OrdersPage = ({
  orders,
  isOwner,
  onViewPayment,
}) => {
  if (orders.length === 0) {
    return <p>Belum ada order</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isOwner={isOwner}
          onViewPayment={onViewPayment}
        />
      ))}
    </div>
  );
};

export default OrdersPage;
