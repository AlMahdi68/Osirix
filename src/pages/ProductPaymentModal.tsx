import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, CheckCircle } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { DigitalProduct } from '../types/index';
import { usePayment } from '../hooks/usePayment';

interface ProductPaymentModalProps {
  product: DigitalProduct;
  onClose: () => void;
  onPaymentSuccess: (transactionId: string) => void;
}

const ProductPaymentModal = ({
  product,
  onClose,
  onPaymentSuccess,
}: ProductPaymentModalProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { processPayment, loading, error, setError } = usePayment();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    country: 'US',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const cardElementRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.name) {
      setError('Please fill in all fields');
      return;
    }

    const cardElement = elements?.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not initialized');
      return;
    }

    const result = await processPayment(
      {
        amount: product.price * 100, // Convert to cents
        currency: 'USD',
        description: `Purchase: ${product.name}`,
        productId: product.id,
        buyerEmail: formData.email,
        metadata: {
          productName: product.name,
          productType: product.productType,
        },
      },
      cardElement
    );

    if (result.success && result.transactionId) {
      setTransactionId(result.transactionId);
      setPaymentSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(result.transactionId!);
      }, 2000);
    }
  };

  if (paymentSuccess && transactionId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800 rounded-xl p-8 max-w-md w-full border border-slate-700 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-4"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
          <p className="text-slate-400 mb-4">
            Thank you for your purchase. Your product access has been granted.
          </p>
          <div className="bg-slate-700 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-slate-400 mb-1">Transaction ID</p>
            <p className="text-sm font-mono text-white break-all">{transactionId}</p>
          </div>
          <p className="text-slate-400 text-sm">Redirecting...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{product.name}</h2>
            <p className="text-purple-100 text-sm capitalize">{product.productType}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price Summary */}
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Subtotal</span>
              <span className="text-white font-semibold">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300">Processing Fee</span>
              <span className="text-white font-semibold">${(product.price * 0.03).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-600 pt-4 flex items-center justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-2xl font-bold text-green-400">
                ${(product.price * 1.03).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-white mb-2 block">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                disabled={loading}
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-white mb-2 block">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                disabled={loading}
              />
            </div>

            {/* Card Details */}
            <div>
              <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Card Details
              </label>
              <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus-within:border-purple-500 transition-colors">
                <CardElement
                  ref={cardElementRef}
                  options={{
                    style: {
                      base: {
                        color: '#ffffff',
                        fontSize: '14px',
                        '::placeholder': {
                          color: '#9ca3af',
                        },
                      },
                      invalid: {
                        color: '#ef4444',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading || !stripe || !elements}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ${(product.price * 1.03).toFixed(2)}
                </>
              )}
            </motion.button>

            {/* Cancel Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductPaymentModal;
