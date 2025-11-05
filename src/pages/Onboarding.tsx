import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Video, Sparkles, Zap, CheckCircle } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Osirix',
      description: 'Your AI-powered platform for creating and monetizing social media content',
      icon: Sparkles,
      content: 'Create stunning content, connect with your audience, and build your income stream all in one place.',
    },
    {
      title: 'Generate Videos with AI',
      description: 'Create professional videos in seconds using advanced AI technology',
      icon: Video,
      content: 'Just describe what you want, and our AI will generate a complete video for you. Customize the style, duration, and platform.',
    },
    {
      title: 'Automate Your Workflow',
      description: 'Schedule posts and automate content distribution across platforms',
      icon: Zap,
      content: 'Use our AutoRun Agent to generate videos, post them to multiple platforms, and track performance automatically.',
    },
    {
      title: 'Monetize Your Content',
      description: 'Create and sell digital products directly to your audience',
      icon: CheckCircle,
      content: 'Build courses, guides, templates, and masterclasses. Integrate with Stripe for seamless payments.',
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400 text-sm">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-slate-400 text-sm">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">{currentStepData.title}</h2>
              <p className="text-slate-400 mb-4">{currentStepData.description}</p>
              <p className="text-slate-300 text-lg leading-relaxed">{currentStepData.content}</p>
            </motion.div>
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-8 py-3 rounded-lg border border-slate-600 text-white font-semibold hover:bg-slate-700 transition disabled:opacity-50"
            >
              Previous
            </motion.button>

            {currentStep === steps.length - 1 ? (
              <Link to="/" className="w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Skip Button */}
          {currentStep < steps.length - 1 && (
            <div className="text-center mt-4">
              <Link to="/" className="text-slate-400 hover:text-slate-300 text-sm">
                Skip tutorial
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
