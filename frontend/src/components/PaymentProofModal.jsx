import React from "react";
import { Check, X } from "lucide-react";

const PaymentProofModal = ({
  show,
  order,
  onClose,
  onVerify,
}) => {
  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold">
          Payment Verification
        </h2>

        <div className="space-y-2 text-sm">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> Rp {order.total}</p>
          <p className="text-gray-500">
            Bukti pembayaran masih dummy (filename)
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => onVerify(order.id, "accept")}
            className="flex-1 bg-green-500 text-white py-2 rounded flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Approve
          </button>

          <button
            onClick={() => onVerify(order.id, "reject")}
            className="flex-1 bg-red-500 text-white py-2 rounded flex items-center justify-center gap-2"
          >
            <X size={16} />
            Reject
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentProofModal;
