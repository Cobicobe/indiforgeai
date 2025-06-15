import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSolanaPayment } from '../hooks/useSolanaPayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: {
    id: string;
    title: string;
    price: number;
    creator: string;
  };
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, dataset }) => {
  const { processPayment, getBalance, isProcessing, connected } = useSolanaPayment();
  const [balance, setBalance] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen && connected) {
      loadBalance();
    }
  }, [isOpen, connected]);

  const loadBalance = async () => {
    const walletBalance = await getBalance();
    setBalance(walletBalance);
  };

  const handlePayment = async () => {
    if (!connected) return;

    setPaymentStatus('processing');
    
    const result = await processPayment({
      amount: dataset.price,
      recipient: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH', // Platform wallet (demo)
      description: `Purchase of dataset: ${dataset.title}`,
      datasetId: dataset.id,
    });

    if (result?.success) {
      setPaymentStatus('success');
      setTimeout(() => {
        onClose();
        setPaymentStatus('idle');
      }, 2000);
    } else {
      setPaymentStatus('error');
      setTimeout(() => setPaymentStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Purchase Dataset</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900">{dataset.title}</h4>
            <p className="text-sm text-gray-600">by {dataset.creator}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold text-teal-600">{dataset.price} SOL</span>
            </div>
          </div>

          {connected && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Your Balance:</span>
                <span className="font-semibold">{balance.toFixed(4)} SOL</span>
              </div>
              {balance < dataset.price && (
                <p className="text-sm text-red-600 mt-1">
                  Insufficient balance. You need {(dataset.price - balance).toFixed(4)} more SOL.
                </p>
              )}
            </div>
          )}

          {!connected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Please connect your Solana wallet to proceed with payment.
                </span>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">
                  Payment successful! You now have access to this dataset.
                </span>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-800">
                  Payment failed. Please try again.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!connected || balance < dataset.price || isProcessing || paymentStatus === 'success'}
            className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Purchased!
              </>
            ) : (
              `Pay ${dataset.price} SOL`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};