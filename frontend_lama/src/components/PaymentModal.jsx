import React, { useState } from "react";
import {
  X,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { formatCurrency, paymentMethods } from "../services/api";

const PaymentModal = ({
  show,
  onClose,
  cartTotal,
  orderId,
  onConfirmPayment,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMethod) {
      alert("Pilih metode pembayaran dulu");
      return;
    }

    onConfirmPayment(orderId, {
      method: selectedMethod.name,
    });

    setSelectedMethod(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Complete Payment
              </h2>
              <p className="text-sm text-gray-600">
                Pilih metode pembayaran
              </p>
            </div>
            <button onClick={handleClose}>
              <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-3xl font-bold text-orange-600">
              {formatCurrency(cartTotal)}
            </span>
          </div>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >

          {/* PAYMENT METHOD */}
          <div>
            <label className="block font-semibold text-gray-700 mb-3">
              1. Metode Pembayaran
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`border-2 rounded-lg p-4 text-left transition ${
                    selectedMethod?.id === method.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {method.type}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PAYMENT DETAIL */}
          {selectedMethod && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Detail Pembayaran – {selectedMethod.name}
                  </h3>

                  {(selectedMethod.type === "bank" ||
                    selectedMethod.type === "ewallet") && (
                    <div className="space-y-2">
                      <div className="bg-white rounded p-3 flex justify-between items-center">
                        <span className="font-mono font-bold">
                          {selectedMethod.account}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(selectedMethod.account)
                          }
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      <div className="bg-white rounded p-3">
                        <p className="text-xs text-gray-500">
                          Atas nama
                        </p>
                        <p className="font-semibold text-gray-800">
                          {selectedMethod.accountName}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-sm text-blue-800">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>
                        Transfer tepat sebesar{" "}
                        <strong>{formatCurrency(cartTotal)}</strong>
                      </li>
                      <li>
                        Simpan bukti pembayaran
                      </li>
                      <li>
                        Klik <strong>Confirm Payment</strong>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTON */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedMethod}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                selectedMethod
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
