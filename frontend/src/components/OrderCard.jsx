import React from 'react';
import { Clock, CheckCircle, Package, Truck, Star, Check } from 'lucide-react';
import { formatCurrency } from '../services/api';

const OrderCard = ({ order, isOwner, onUpdateStatus, onReviewItem, reviews = [] }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'processing': return <Package className="w-5 h-5" />;
      case 'ready': return <CheckCircle className="w-5 h-5" />;
      case 'delivered': return <Truck className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if item has been reviewed
  const hasReviewed = (itemId) => {
    return reviews.some(review => 
      review.orderId === order.id && review.menuItemId === itemId
    );
  };

  // Get review for specific item
  const getItemReview = (itemId) => {
    return reviews.find(review => 
      review.orderId === order.id && review.menuItemId === itemId
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500">Order #{order.id}</p>
          <p className="text-sm text-gray-600">{order.date}</p>
          {isOwner && (
            <p className="font-semibold text-gray-800 mt-1">Customer: {order.customerName}</p>
          )}
        </div>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="font-semibold capitalize">{order.status}</span>
        </div>
      </div>
      
      <div className="border-t pt-4 mb-4 space-y-3">
        {order.items.map(item => {
          const reviewed = hasReviewed(item.id);
          const itemReview = getItemReview(item.id);

          return (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{item.name} x{item.quantity}</span>
                  <span className="text-gray-800 font-medium ml-4">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
                
                {/* Tombol Review - Hanya untuk customer & delivered order */}
                {!isOwner && order.status === 'delivered' && (
                  <div className="mt-2">
                    {reviewed ? (
                      // Sudah review - tampilkan badge
                      <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg">
                        <Check className="w-4 h-4" />
                        <span>Reviewed</span>
                        {itemReview && (
                          <div className="flex items-center ml-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="ml-0.5 font-semibold">{itemReview.rating}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Belum review - tampilkan tombol
                      <button
                        onClick={() => onReviewItem(order.id, item)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                      >
                        <Star className="w-4 h-4" />
                        <span>Write Review</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-lg font-bold text-gray-800">Total:</span>
        <span className="text-2xl font-bold text-orange-600">
          {formatCurrency(order.total)}
        </span>
      </div>
      
      {isOwner && order.status !== 'delivered' && (
        <div className="mt-4 flex gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'processing')}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Start Processing
            </button>
          )}
          {order.status === 'processing' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Mark as Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;