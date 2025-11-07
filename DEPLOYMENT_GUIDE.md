# Osirix Deployment & Payment Integration Guide

This guide covers deploying Osirix to production and setting up a fully functional payment system with Stripe.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Stripe Setup](#stripe-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Testing Payments](#testing-payments)
7. [Production Checklist](#production-checklist)

## Quick Start

### For Development

```bash
# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

The app will be available at `http://localhost:5173`

## Stripe Setup

### Step 1: Create a Stripe Account

1. Go to https://stripe.com
2. Click "Sign up" and create your account
3. Verify your email address
4. Complete your account setup

### Step 2: Get Your API Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to **Developers** > **API keys**
3. You'll see:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

**Important:** Keep your Secret Key private! Never share it or commit it to version control.

### Step 3: Create Products and Prices

For Osirix, you need to create three products (one for each plan):

#### Free Plan
- No product needed (no payment)

#### Pro Plan ($29/month)

1. Go to **Products** in Stripe Dashboard
2. Click **Add product**
3. Fill in:
   - Name: "Osirix Pro"
   - Description: "Pro Plan - $29/month"
4. Set pricing:
   - Price: $29.00
   - Billing period: Monthly
   - Recurring: Yes
4. Save the product
5. Copy the **Price ID** (starts with `price_`)

#### Enterprise Plan ($99/month)

Repeat the same process with:
- Name: "Osirix Enterprise"
- Price: $99.00

### Step 4: Set Up Webhooks (Optional but Recommended)

Webhooks allow Stripe to notify your backend about payment events:

1. Go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Enter your backend URL: `https://your-backend.com/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing Secret** (starts with `whsec_`)

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

Vercel is optimized for Vite/React applications and offers automatic deployments from GitHub.

#### Step 1: Connect GitHub

1. Go to https://vercel.com
2. Sign up with your GitHub account
3. Click "Import Project"
4. Select your Osirix repository

#### Step 2: Configure Environment Variables

1. In Vercel dashboard, go to **Settings** > **Environment Variables**
2. Add the following variables:

```
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
```

#### Step 3: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be available at a Vercel URL (e.g., `osirix.vercel.app`)

**Automatic Deployments:** Every push to the `main` branch will automatically deploy!

### Option 2: Deploy to Netlify

1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build command: `pnpm build`
5. Set publish directory: `dist`
6. Add environment variables:
   - `VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY`
7. Deploy!

### Option 3: Deploy to GitHub Pages

```bash
# Build the project
pnpm build

# Create a gh-pages branch
git checkout --orphan gh-pages

# Add dist files
git add dist -f
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git push -u origin gh-pages
```

Then enable GitHub Pages in your repository settings.

## Backend Deployment

Your backend API handles sensitive operations like payment processing. Here's how to set it up:

### Option 1: Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create a new app
heroku create osirix-api

# Set environment variables
heroku config:set STRIPE_SECRET_KEY=sk_test_YOUR_KEY
heroku config:set STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
heroku config:set DATABASE_URL=postgresql://...

# Deploy
git push heroku main
```

### Option 2: Deploy to Railway

1. Go to https://railway.app
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy!

### Option 3: Deploy to AWS Lambda + API Gateway

See AWS documentation for serverless deployment.

## Environment Configuration

### Development (.env.local)

```bash
# Stripe Test Keys
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_TEST_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY

# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://localhost:5432/osirix

# OpenAI (for AI features)
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY

# Social Media
TWITTER_API_KEY=YOUR_TWITTER_KEY
INSTAGRAM_API_KEY=YOUR_INSTAGRAM_KEY
```

### Production

Replace all `pk_test_` and `sk_test_` keys with their `pk_live_` and `sk_live_` equivalents.

## Testing Payments

### Test Card Numbers

Use these in test mode:

| Scenario | Card Number | Expiry | CVC |
| :--- | :--- | :--- | :--- |
| Successful | 4242 4242 4242 4242 | 12/25 | 123 |
| Declined | 4000 0000 0000 0002 | 12/25 | 123 |
| 3D Secure | 4000 0025 0000 3155 | 12/25 | 123 |
| Visa Debit | 4000 0566 5566 5556 | 12/25 | 123 |
| Mastercard | 5555 5555 5555 4444 | 12/25 | 123 |
| Amex | 3782 822463 10005 | 12/25 | 1234 |

### Test Payment Flow

1. Navigate to `/pricing` in your app
2. Click "Upgrade Now" on Pro or Enterprise plan
3. Enter test email and name
4. Use a test card number above
5. Click "Upgrade"
6. You should see a success message

### Verify in Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Navigate to **Payments** or **Customers**
3. You should see your test payment

## Production Checklist

Before going live with real payments:

- [ ] Switch to live Stripe keys (`pk_live_` and `sk_live_`)
- [ ] Test payment flow with live keys
- [ ] Set up SSL/HTTPS on all domains
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable rate limiting on API
- [ ] Set up monitoring and alerting
- [ ] Configure email notifications
- [ ] Set up customer support system
- [ ] Review Stripe security best practices
- [ ] Set up webhook handlers
- [ ] Test refund process
- [ ] Document payment procedures
- [ ] Create incident response plan

## Troubleshooting

### Payment Fails with "Invalid API Key"

- Check that you're using the correct Stripe key
- Ensure the key matches your environment (test vs. live)
- Verify the key is set in environment variables

### "Stripe not initialized" Error

- Ensure `VITE_STRIPE_PUBLIC_KEY` is set
- Check browser console for errors
- Verify the key is valid

### Webhook Events Not Received

- Check webhook endpoint URL is correct
- Verify endpoint is publicly accessible
- Check webhook signing secret is correct
- Review Stripe webhook logs

### Payment Succeeds But Subscription Not Created

- Check backend logs
- Verify database connection
- Ensure payment confirmation endpoint is working
- Review error messages in Stripe dashboard

## Support & Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Osirix GitHub:** https://github.com/AlMahdi68/Osirix
- **Vercel Docs:** https://vercel.com/docs
- **React Stripe:** https://stripe.com/docs/stripe-js/react

## Next Steps

1. Deploy frontend to Vercel
2. Deploy backend API
3. Configure Stripe webhooks
4. Test payment flow end-to-end
5. Monitor for errors
6. Iterate based on user feedback

Good luck with your launch! 🚀
