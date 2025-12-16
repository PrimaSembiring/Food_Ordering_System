import React from 'react';
import { X } from 'lucide-react';

const PaymentProofModal = ({ show, onClose, proofImage }) => {
  if (!show || !proofImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Payment Proof</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-100 flex items-center justify-center">
          <img
            src={proofImage}
            alt="Payment proof"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentProofModal;