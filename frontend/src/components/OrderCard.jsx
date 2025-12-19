import React from "react";
import {
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Eye,
  Star,
} from "lucide-react";
import { formatCurrency } from "../services/api";

/* =========================
   STATUS MAPPING (BACKEND)
========================= */
const STATUS_UI = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="w-5 h-5" />,
  },
  PAYMENT_UPLOADED: {
    label: "Payment Uploaded",
    color: "bg-blue-100 text-blue-800",
    icon: <AlertCircle className="w-5 h-5" />,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    icon: <Package className="w-5 h-5" />,
  },
  READY: {
    label: "Ready",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-gray-100 text-gray-800",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  PAYMENT_REJECTED: {
    label: "Payment Rejected",
    color: "bg-red-100 text-red-800",
    icon: <AlertCircle className="w-5 h-5" />,
  },
};

const OrderCard = ({
  order,
  isOwner,
  onViewPayment,
  onReviewItem,
}) => {
  const status = STATUS_UI[order.status] || STATUS_UI.PENDING;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Order #{order.id}</p>
          {order.date && (
            <p className="text-sm text-gray-600">{order.date}</p>
          )}
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${status.color}`}
        >
          {status.icon}
          <span className="font-semibold">{status.label}</span>
        </div>
      </div>

      {/* ITEMS */}
      <div className="border-t pt-4 space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold text-orange-600">
          {formatCurrency(order.total)}
        </span>
      </div>

      {/* OWNER ACTION */}
      {isOwner && order.status === "PAYMENT_UPLOADED" && (
        <button
          onClick={() => onViewPayment(order)}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Verify Payment
        </button>
      )}

      {/* CUSTOMER REVIEW */}
      {!isOwner && order.status === "DELIVERED" && (
        <button
          onClick={() => onReviewItem(order)}
          className="w-full mt-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          <Star className="w-4 h-4" />
          Write Review
        </button>
      )}
    </div>
  );
};

export default OrderCard;
