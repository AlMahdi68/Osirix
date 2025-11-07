# Osirix Backend Setup Guide

This guide covers setting up the backend API for Osirix with Stripe payment integration.

## Overview

The Osirix platform requires a backend API to handle:
- Payment processing with Stripe
- User authentication
- Subscription management
- Content scheduling
- Social media integration

## Prerequisites

- Node.js 16+ or Python 3.8+
- Stripe account (https://stripe.com)
- Database (PostgreSQL, MongoDB, or similar)

## Stripe Setup

### 1. Create a Stripe Account

1. Go to https://stripe.com and create an account
2. Verify your email
3. Complete your account setup

### 2. Get Your API Keys

1. Navigate to https://dashboard.stripe.com/apikeys
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Configure Environment Variables

Create a `.env` file in your backend directory:

```bash
# Stripe Keys (use test keys for development)
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/osirix

# Server
PORT=3000
NODE_ENV=development
```

## Backend API Endpoints

### Payment Endpoints

#### Create Payment Intent
```
POST /api/payments/create-intent
Content-Type: application/json

{
  "amount": 9999,
  "currency": "usd",
  "description": "Premium Plan Subscription",
  "productId": "prod_123",
  "buyerEmail": "user@example.com",
  "metadata": {
    "userId": "user_123",
    "planType": "premium"
  }
}

Response:
{
  "clientSecret": "pi_1234567890_secret_abcdef",
  "paymentIntentId": "pi_1234567890"
}
```

#### Confirm Payment
```
POST /api/payments/confirm
Content-Type: application/json

{
  "paymentIntentId": "pi_1234567890",
  "paymentMethodId": "pm_1234567890"
}

Response:
{
  "success": true,
  "transactionId": "txn_1234567890",
  "status": "succeeded"
}
```

#### Get Payment History
```
GET /api/payments/history?email=user@example.com

Response:
{
  "payments": [
    {
      "id": "txn_1234567890",
      "amount": 9999,
      "currency": "usd",
      "status": "succeeded",
      "date": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Subscription Endpoints

#### Create Subscription
```
POST /api/subscriptions/create
Content-Type: application/json

{
  "email": "user@example.com",
  "planId": "price_1234567890",
  "paymentMethodId": "pm_1234567890"
}

Response:
{
  "subscriptionId": "sub_1234567890",
  "status": "active",
  "currentPeriodEnd": "2024-02-15T10:30:00Z"
}
```

#### Cancel Subscription
```
POST /api/subscriptions/{subscriptionId}/cancel

Response:
{
  "subscriptionId": "sub_1234567890",
  "status": "canceled",
  "canceledAt": "2024-01-15T10:30:00Z"
}
```

## Example Backend Implementation (Node.js/Express)

```javascript
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Create Payment Intent
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { amount, currency, description, buyerEmail, metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency,
      description,
      receipt_email: buyerEmail,
      metadata,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Confirm Payment
app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    res.json({
      success: paymentIntent.status === 'succeeded',
      transactionId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Subscription
app.post('/api/subscriptions/create', async (req, res) => {
  try {
    const { email, planId, paymentMethodId } = req.body;

    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planId }],
      payment_settings: {
        payment_method_types: ['card'],
      },
    });

    res.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Backend API running on http://localhost:3000');
});
```

## Testing Stripe Integration

### Test Card Numbers

Use these card numbers in test mode:

| Card Type | Number | Expiry | CVC |
| :--- | :--- | :--- | :--- |
| Visa | 4242 4242 4242 4242 | 12/25 | 123 |
| Visa (Debit) | 4000 0566 5566 5556 | 12/25 | 123 |
| Mastercard | 5555 5555 5555 4444 | 12/25 | 123 |
| American Express | 3782 822463 10005 | 12/25 | 1234 |

### Test Scenarios

- **Successful Payment**: Use any of the test cards above
- **Declined Card**: Use `4000 0000 0000 0002`
- **Requires Authentication**: Use `4000 0025 0000 3155`

## Deployment

### Environment Variables for Production

When deploying to production:

1. Use **live** Stripe keys (starting with `pk_live_` and `sk_live_`)
2. Set `NODE_ENV=production`
3. Use a production database
4. Enable HTTPS
5. Configure proper CORS settings

### Vercel Deployment

Add environment variables in Vercel dashboard:
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `DATABASE_URL`
- `FRONTEND_URL`

### Heroku Deployment

```bash
heroku config:set STRIPE_SECRET_KEY=sk_live_YOUR_KEY
heroku config:set STRIPE_PUBLIC_KEY=pk_live_YOUR_KEY
heroku config:set DATABASE_URL=postgresql://...
```

## Security Considerations

1. **Never expose secret keys** in frontend code
2. **Always validate** payment amounts on the backend
3. **Use HTTPS** for all API calls
4. **Implement rate limiting** to prevent abuse
5. **Store sensitive data** securely
6. **Use webhooks** to handle asynchronous payment events

## Stripe Webhooks

Set up webhooks to handle payment events:

```javascript
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
    case 'customer.subscription.updated':
      // Handle subscription update
      break;
  }

  res.json({ received: true });
});
```

## Support

For more information:
- Stripe Documentation: https://stripe.com/docs
- Osirix GitHub: https://github.com/AlMahdi68/Osirix
- Stripe Support: https://support.stripe.com
