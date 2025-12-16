import React from 'react';
import { Clock, CheckCircle, Package, Truck, Star, Check, CreditCard, XCircle, AlertCircle, Eye } from 'lucide-react';
import { formatCurrency } from '../services/api';

const OrderCard = ({ order, isOwner, onUpdateStatus, onReviewItem, onViewPaymentProof, onVerifyPayment, reviews = [] }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'waiting_payment': return <CreditCard className="w-5 h-5" />;
      case 'payment_uploaded': return <AlertCircle className="w-5 h-5" />;
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'processing': return <Package className="w-5 h-5" />;
      case 'ready': return <CheckCircle className="w-5 h-5" />;
      case 'delivered': return <Truck className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'waiting_payment': return 'bg-purple-100 text-purple-800';
      case 'payment_uploaded': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'waiting_payment': return 'Waiting Payment';
      case 'payment_uploaded': return 'Payment Uploaded';
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'ready': return 'Ready';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
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
          <span className="font-semibold capitalize">{getStatusText(order.status)}</span>
        </div>
      </div>

      {/* Payment Info */}
      {order.paymentMethod && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Payment Method:</p>
              <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
            </div>
            {order.paymentProof && (
              <button
                onClick={() => onViewPaymentProof && onViewPaymentProof(order.paymentProof)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
              >
                <Eye className="w-4 h-4" />
                <span>View Proof</span>
              </button>
            )}
          </div>
        </div>
      )}
      
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

                {/* Display Review for Owner */}
                {isOwner && itemReview && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < itemReview.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {itemReview.rating}/5 - {itemReview.customerName}
                      </span>
                    </div>
                    {itemReview.comment && (
                      <p className="text-sm text-gray-700 italic">"{itemReview.comment}"</p>
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
      
      {/* Owner Actions */}
      {isOwner && (
        <div className="mt-4 space-y-2">
          {/* Payment Verification */}
          {order.status === 'payment_uploaded' && (
            <div className="flex gap-2">
              <button
                onClick={() => onVerifyPayment(order.id, 'approved')}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
              >
                ✓ Approve Payment
              </button>
              <button
                onClick={() => onVerifyPayment(order.id, 'rejected')}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                ✗ Reject Payment
              </button>
            </div>
          )}
          
          {/* Order Status Update */}
          {order.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'processing')}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Start Processing
            </button>
          )}
          {order.status === 'processing' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Mark as Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      )}

      {/* Customer Payment Reminder */}
      {!isOwner && order.status === 'waiting_payment' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Action Required:</strong> Please complete your payment to proceed with this order.
          </p>
        </div>
      )}

      {!isOwner && order.status === 'payment_uploaded' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Payment Under Review:</strong> Your payment is being verified by the restaurant.
          </p>
        </div>
      )}

      {!isOwner && order.status === 'cancelled' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>✗ Order Cancelled:</strong> This order has been cancelled. Payment was not verified.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderCard;