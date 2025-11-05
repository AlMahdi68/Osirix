import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, CreditCard } from 'lucide-react';
import { PRICING_PLANS } from '../utils/pricingPlans';
import { useAppStore } from '../store/appStore';
import PlanUpgradeModal from './PlanUpgradeModal';

const Pricing = () => {
  const { subscription, setSubscription } = useAppStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleUpgradePlan = (planId: string) => {
    if (planId === 'free') {
      // Free plan, no payment needed
      setSubscription({
        planId: planId as 'free' | 'pro' | 'enterprise',
        startDate: new Date(),
        active: true,
        monthlyUsage: {
          videosGenerated: 0,
          charactersCreated: 0,
          voicesGenerated: 0,
          postsScheduled: 0,
          autoRunExecutions: 0,
          productsCreated: 0,
        },
      });
    } else {
      // Paid plan, show payment modal
      setSelectedPlanId(planId);
      setShowUpgradeModal(true);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-slate-400 text-lg">Choose the perfect plan for your content creation needs</p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-xl p-8 border transition-all ${
                plan.popular
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 ring-2 ring-purple-400 transform md:scale-105 shadow-2xl'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Info */}
              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-purple-100' : 'text-slate-400'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-white'}`}>
                    ${plan.price}
                  </span>
                  <span className={plan.popular ? 'text-purple-100' : 'text-slate-400'}>
                    /month
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUpgradePlan(plan.id)}
                disabled={subscription?.planId === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-semibold mb-8 transition-all flex items-center justify-center gap-2 ${
                  subscription?.planId === plan.id
                    ? plan.popular
                      ? 'bg-white/20 text-white cursor-default'
                      : 'bg-slate-700 text-white cursor-default'
                    : plan.popular
                      ? 'bg-white hover:bg-purple-100 text-purple-600'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {subscription?.planId === plan.id ? (
                  <>
                    <Check className="w-5 h-5" />
                    Current Plan
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {plan.id === 'free' ? 'Get Started' : 'Upgrade Now'}
                  </>
                )}
              </motion.button>

              {/* Features */}
              <div className="space-y-4">
                <p className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
                  plan.popular ? 'text-purple-100' : 'text-slate-400'
                }`}>
                  Features
                </p>
                <div className="space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <motion.div
                      key={featureIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + featureIdx * 0.02 }}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-white' : 'text-green-400'
                        }`} />
                      ) : (
                        <X className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-purple-100/40' : 'text-slate-600'
                        }`} />
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? plan.popular ? 'text-white' : 'text-slate-300'
                          : plan.popular ? 'text-purple-100/60' : 'text-slate-500'
                      }`}>
                        {feature.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-slate-800 rounded-xl p-8 border border-slate-700"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 30-day money-back guarantee for all new subscriptions, no questions asked.',
              },
              {
                q: 'What happens to my data if I downgrade?',
                a: 'Your data is safe. We only enforce limits on new content creation going forward.',
              },
              {
                q: 'Do you have enterprise pricing?',
                a: 'Yes! Contact our sales team at sales@osirix.com for custom enterprise quotes.',
              },
            ].map((item, idx) => (
              <div key={idx} className="border-l-2 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upgrade Modal */}
        {showUpgradeModal && selectedPlanId && (
          <PlanUpgradeModal
            planId={selectedPlanId}
            onClose={() => {
              setShowUpgradeModal(false);
              setSelectedPlanId(null);
            }}
            onPaymentSuccess={(planId) => {
              setSubscription({
                planId: planId as 'free' | 'pro' | 'enterprise',
                startDate: new Date(),
                active: true,
                monthlyUsage: {
                  videosGenerated: 0,
                  charactersCreated: 0,
                  voicesGenerated: 0,
                  postsScheduled: 0,
                  autoRunExecutions: 0,
                  productsCreated: 0,
                },
              });
              setShowUpgradeModal(false);
              setSelectedPlanId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Pricing;
