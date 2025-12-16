import React, { useState } from 'react';
import { X, Upload, Copy, Check, AlertCircle } from 'lucide-react';
import { formatCurrency, paymentMethods } from '../services/api';

const PaymentModal = ({ show, onClose, cartTotal, onConfirmPayment }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyAccount = (account) => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    if (!paymentProof) {
      alert('Please upload payment proof');
      return;
    }
    
    onConfirmPayment({
      method: selectedMethod.name,
      methodId: selectedMethod.id,
      proof: paymentProofPreview,
      proofFile: paymentProof
    });
    
    // Reset
    setSelectedMethod(null);
    setPaymentProof(null);
    setPaymentProofPreview(null);
  };

  const handleCloseModal = () => {
    setSelectedMethod(null);
    setPaymentProof(null);
    setPaymentProofPreview(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
              <p className="text-sm text-gray-600 mt-1">Select payment method and upload proof</p>
            </div>
            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Amount:</span>
              <span className="text-3xl font-bold text-orange-600">
                {formatCurrency(cartTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                1. Select Payment Method *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`p-4 border-2 rounded-lg transition text-left ${
                      selectedMethod?.id === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{method.name}</p>
                        <p className="text-xs text-gray-500">{method.description || method.type}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Details */}
            {selectedMethod && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 fade-in">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Payment Details - {selectedMethod.name}
                    </h3>
                    
                    {selectedMethod.type === 'qr' && (
                      <div className="bg-white rounded-lg p-4 mb-3">
                        <div className="bg-gray-200 h-48 flex items-center justify-center rounded">
                          <div className="text-center">
                            <div className="text-6xl mb-2">📱</div>
                            <p className="text-gray-600 text-sm">QRIS Code</p>
                            <p className="text-xs text-gray-500 mt-1">Scan dengan aplikasi e-wallet</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(selectedMethod.type === 'ewallet' || selectedMethod.type === 'bank') && (
                      <div className="space-y-2">
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-gray-600 mb-1">Account Number:</p>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-gray-800">
                              {selectedMethod.account}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyAccount(selectedMethod.account)}
                              className="p-2 hover:bg-gray-100 rounded transition"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-gray-600 mb-1">Account Name:</p>
                          <span className="font-semibold text-gray-800">
                            {selectedMethod.accountName}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 text-sm text-blue-800">
                      <p className="font-medium">Instructions:</p>
                      <ol className="list-decimal list-inside space-y-1 mt-1 text-xs">
                        <li>Transfer exactly {formatCurrency(cartTotal)}</li>
                        <li>Take a screenshot of the transaction</li>
                        <li>Upload the proof below</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Payment Proof */}
            {selectedMethod && (
              <div className="fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  2. Upload Payment Proof *
                </label>
                
                {!paymentProofPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="payment-proof"
                    />
                    <label
                      htmlFor="payment-proof"
                      className="cursor-pointer"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Click to upload payment proof</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={paymentProofPreview}
                      alt="Payment proof"
                      className="w-full max-h-64 object-contain rounded-lg border-2 border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentProof(null);
                        setPaymentProofPreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                      ✓ Payment proof uploaded successfully
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedMethod || !paymentProof}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  selectedMethod && paymentProof
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;