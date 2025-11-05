import { useState } from 'react';
import { StripeCardElement } from '@stripe/react-stripe-js';
import { StripeError } from '@stripe/stripe-js';

export interface PaymentConfig {
  amount: number;
  currency: string;
  description: string;
  productId: string;
  buyerEmail: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (
    config: PaymentConfig,
    cardElement: StripeCardElement | null
  ): Promise<PaymentResult> => {
    if (!cardElement) {
      return {
        success: false,
        error: 'Card element not initialized',
      };
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      // In production, this would call your backend API which uses Stripe
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate transaction ID
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        transactionId,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const validateCardInput = (cardElement: StripeCardElement | null): boolean => {
    if (!cardElement) {
      setError('Card element not initialized');
      return false;
    }
    setError(null);
    return true;
  };

  return {
    processPayment,
    validateCardInput,
    loading,
    error,
    setError,
  };
};
