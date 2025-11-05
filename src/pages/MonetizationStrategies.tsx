import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Users, DollarSign, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAI } from '../hooks/useAI';

const MonetizationStrategies = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [strategy, setStrategy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { generateText } = useAI();

  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      minFollowers: '10K',
      avgEarnings: '$200-500/mo',
      methods: ['Creator Fund', 'Sponsored Videos', 'Live Gifts'],
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      minFollowers: '10K',
      avgEarnings: '$300-800/mo',
      methods: ['Reels Bonus', 'Sponsored Posts', 'Affiliate Links'],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '📺',
      minFollowers: '1K',
      avgEarnings: '$500-2K/mo',
      methods: ['Ad Revenue', 'Sponsorships', 'Super Chat'],
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: '𝕏',
      minFollowers: 'None',
      avgEarnings: '$100-500/mo',
      methods: ['Ad Revenue Share', 'Sponsored Posts', 'Patreon'],
    },
  ];

  const strategies = [
    {
      title: 'Niche Domination',
      description: 'Become an authority in a specific niche with consistent content',
      revenue: '$500-2K/mo',
      timeframe: '3-6 months',
      steps: [
        'Choose a specific niche (e.g., productivity, fitness, tech)',
        'Create 3 posts per week in that niche',
        'Engage with similar creators and communities',
        'Build authority through consistent quality',
      ],
    },
    {
      title: 'Multi-Platform Strategy',
      description: 'Distribute content across multiple platforms for diversified income',
      revenue: '$1K-5K/mo',
      timeframe: '4-8 months',
      steps: [
        'Create platform-specific content',
        'Cross-promote between platforms',
        'Use AI to optimize for each platform',
        'Track performance on each channel',
      ],
    },
    {
      title: 'Affiliate Marketing',
      description: 'Earn commissions by promoting products relevant to your audience',
      revenue: '$300-1K/mo',
      timeframe: '1-3 months',
      steps: [
        'Join affiliate programs (Amazon, ShareASale, CJ)',
        'Recommend products authentically',
        'Include affiliate links in bio/descriptions',
        'Track and optimize conversions',
      ],
    },
    {
      title: 'Sponsored Content',
      description: 'Partner with brands for paid promotional content',
      revenue: '$200-1K per post',
      timeframe: 'Immediate',
      steps: [
        'Build media kit with audience stats',
        'Reach out to brands in your niche',
        'Use platforms like AspireIQ, Upfluence',
        'Negotiate rates and deliverables',
      ],
    },
  ];

  const handleGetStrategy = async () => {
    if (!selectedPlatform) return;
    setLoading(true);
    try {
      const prompt = `Provide a detailed monetization strategy for a ${selectedPlatform} content creator. Include specific steps, timeline, potential earnings, and tips for success.`;
      const result = await generateText(prompt);
      setStrategy(result);
    } catch (error) {
      console.error('Failed to generate strategy:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Monetization Strategies</h1>
          <p className="text-slate-400">Turn your social media presence into income</p>
        </motion.div>

        {/* Platform Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {platforms.map((platform, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`rounded-xl p-6 border-2 cursor-pointer transition-all ${
                selectedPlatform === platform.id
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400'
                  : 'bg-slate-800 border-slate-700 hover:border-purple-500'
              }`}
            >
              <div className="text-4xl mb-3">{platform.icon}</div>
              <h3 className={`text-lg font-bold mb-2 ${selectedPlatform === platform.id ? 'text-white' : 'text-white'}`}>
                {platform.name}
              </h3>
              <div className={`space-y-2 text-sm ${selectedPlatform === platform.id ? 'text-white/90' : 'text-slate-400'}`}>
                <p>Min: {platform.minFollowers}</p>
                <p className={selectedPlatform === platform.id ? 'font-semibold text-white' : 'font-semibold'}>
                  {platform.avgEarnings}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Strategy Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">AI Strategy Generator</h2>
              <p className="text-slate-300">Get personalized monetization advice for your platform</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStrategy}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap"
            >
              {loading ? 'Generating...' : 'Get AI Strategy'}
            </motion.button>
          </div>

          {strategy && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700"
            >
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 whitespace-pre-wrap">{strategy}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Pre-built Strategies */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Proven Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.map((strat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ translateY: -5 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{strat.title}</h3>
                    <p className="text-slate-400 text-sm">{strat.description}</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-purple-400 flex-shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 pb-4 border-b border-slate-700">
                  <div>
                    <p className="text-slate-400 text-xs">Potential Earnings</p>
                    <p className="text-green-400 font-bold">{strat.revenue}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Timeline</p>
                    <p className="text-white font-bold">{strat.timeframe}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {strat.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-slate-800 rounded-xl p-8 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">💡 Pro Tips for Maximum Earnings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Consistency is Key',
                desc: 'Post regularly to build and maintain audience momentum',
              },
              {
                title: 'Engage Authentically',
                desc: 'Reply to comments and build genuine relationships with followers',
              },
              {
                title: 'Track Analytics',
                desc: 'Use data to understand what content works best for monetization',
              },
              {
                title: 'Diversify Income',
                desc: 'Don\'t rely on one platform - spread across multiple channels',
              },
              {
                title: 'Quality Over Quantity',
                desc: 'Higher quality content attracts better-paying sponsorships',
              },
              {
                title: 'Build Community',
                desc: 'Engaged community is more valuable than large follower count',
              },
            ].map((tip, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />
                <div>
                  <h3 className="font-bold text-white mb-1">{tip.title}</h3>
                  <p className="text-slate-400 text-sm">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MonetizationStrategies;
