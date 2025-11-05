import { PricingPlan } from '../types/index';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'month',
    description: 'Perfect for getting started with content creation',
    features: [
      { name: 'Up to 5 AI videos/month', included: true },
      { name: 'Up to 5 characters/month', included: true },
      { name: 'Up to 5 voiceovers/month', included: true },
      { name: 'Schedule up to 10 posts', included: true },
      { name: '1 AutoRun workflow', included: true },
      { name: 'Up to 3 digital products', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Priority support', included: false },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
    limits: {
      monthlyVideos: 5,
      monthlyCharacters: 5,
      monthlyVoices: 5,
      scheduledPosts: 10,
      autoRunWorkflows: 1,
      digitalProducts: 3,
      maxProductPrice: 99,
      customBranding: false,
      prioritySupport: false,
      apiAccess: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    billingPeriod: 'month',
    description: 'For serious content creators wanting to scale',
    popular: true,
    features: [
      { name: 'Up to 50 AI videos/month', included: true },
      { name: 'Up to 50 characters/month', included: true },
      { name: 'Up to 50 voiceovers/month', included: true },
      { name: 'Schedule up to 100 posts', included: true },
      { name: '5 AutoRun workflows', included: true },
      { name: 'Up to 20 digital products', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
    limits: {
      monthlyVideos: 50,
      monthlyCharacters: 50,
      monthlyVoices: 50,
      scheduledPosts: 100,
      autoRunWorkflows: 5,
      digitalProducts: 20,
      maxProductPrice: 499,
      customBranding: false,
      prioritySupport: true,
      apiAccess: false,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    billingPeriod: 'month',
    description: 'For agencies and large-scale operations',
    features: [
      { name: 'Unlimited AI videos', included: true },
      { name: 'Unlimited characters', included: true },
      { name: 'Unlimited voiceovers', included: true },
      { name: 'Unlimited scheduled posts', included: true },
      { name: 'Unlimited AutoRun workflows', included: true },
      { name: 'Unlimited digital products', included: true },
      { name: 'Full analytics suite', included: true },
      { name: 'Priority 24/7 support', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: true },
    ],
    limits: {
      monthlyVideos: 999999,
      monthlyCharacters: 999999,
      monthlyVoices: 999999,
      scheduledPosts: 999999,
      autoRunWorkflows: 999999,
      digitalProducts: 999999,
      maxProductPrice: 9999,
      customBranding: true,
      prioritySupport: true,
      apiAccess: true,
    },
  },
];

export const getPlanById = (planId: string) => {
  return PRICING_PLANS.find(p => p.id === planId) || PRICING_PLANS[0];
};

export const getNextTierPlan = (currentPlanId: string) => {
  const currentIndex = PRICING_PLANS.findIndex(p => p.id === currentPlanId);
  if (currentIndex < PRICING_PLANS.length - 1) {
    return PRICING_PLANS[currentIndex + 1];
  }
  return null;
};
