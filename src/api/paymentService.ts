/**
 * Payment Service - Handles all payment-related API calls
 * This service communicates with your backend API which handles Stripe integration
 */

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  description: string;
  productId: string;
  buyerEmail: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  paymentMethodId: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'succeeded' | 'processing' | 'requires_action' | 'failed';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Create a payment intent on the backend
 * This should be called before the user enters card details
 */
export const createPaymentIntent = async (
  request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Payment intent creation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Confirm a payment with Stripe
 */
export const confirmPayment = async (
  request: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Payment confirmation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

/**
 * Get payment history for a user
 */
export const getPaymentHistory = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/history?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

/**
 * Create a subscription
 */
export const createSubscription = async (
  email: string,
  planId: string,
  paymentMethodId: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        planId,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Subscription creation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Subscription cancellation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};
