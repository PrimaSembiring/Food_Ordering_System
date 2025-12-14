import React from 'react';
import { Package } from 'lucide-react';
import OrderCard from '../components/OrderCard';

const OrdersPage = ({ orders, isOwner, onUpdateStatus }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {isOwner ? 'Incoming Orders' : 'My Orders'}
      </h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isOwner={isOwner}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;