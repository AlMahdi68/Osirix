import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/react-stripe-js';

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
  paymentIntentId?: string;
}

export const usePaymentEnhanced = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (
    config: PaymentConfig,
    cardElement?: StripeCardElement | null
  ): Promise<PaymentResult> => {
    if (!stripe || !elements) {
      return {
        success: false,
        error: 'Stripe not initialized',
      };
    }

    setLoading(true);
    setError(null);

    try {
      const card = cardElement || elements.getElement(CardElement);

      if (!card) {
        return {
          success: false,
          error: 'Card element not found',
        };
      }

      // Create a payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: {
          email: config.buyerEmail,
        },
      });

      if (methodError) {
        setError(methodError.message);
        return {
          success: false,
          error: methodError.message,
        };
      }

      // In a real scenario, you would send this to your backend
      // For now, we'll simulate a successful payment
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate backend processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        transactionId,
        paymentIntentId: paymentMethod?.id,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const validateCardInput = (): boolean => {
    if (!stripe || !elements) {
      setError('Stripe not initialized');
      return false;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError('Card element not found');
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
    stripe,
    elements,
  };
};
